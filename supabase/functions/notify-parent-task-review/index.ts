/// <reference path="../deno.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type NotifyTaskReviewPayload = {
  childId?: string;
  loginCode?: string;
  taskId?: string;
};

const expoPushUrl = "https://exp.host/--/api/v2/push/send";

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { childId, loginCode, taskId } = (await req.json()) as NotifyTaskReviewPayload;

    if (!childId || !loginCode || !taskId) {
      return jsonResponse({ error: "Missing childId, loginCode or taskId" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Missing Supabase function environment" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, login_code, family_id")
      .eq("id", childId)
      .eq("login_code", loginCode)
      .maybeSingle();

    if (childError) throw childError;

    if (!child) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    const { data: task, error: taskError } = await supabase
      .from("child_tasks")
      .select("id, child_id, status")
      .eq("id", taskId)
      .eq("child_id", childId)
      .maybeSingle();

    if (taskError) throw taskError;

    if (!task || task.status !== "review") {
      return jsonResponse({ error: "Task is not waiting for review" }, 409);
    }

    const { data: family, error: familyError } = await supabase
      .from("families")
      .select("parent_id")
      .eq("id", child.family_id)
      .maybeSingle();

    if (familyError) throw familyError;

    if (!family?.parent_id) {
      return jsonResponse({ error: "Parent not found" }, 404);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("expo_push_token, parent_notifications_enabled")
      .eq("id", family.parent_id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile?.expo_push_token || profile.parent_notifications_enabled === false) {
      return jsonResponse({
        sent: false,
        reason: "Parent notifications disabled or token missing",
      });
    }

    const pushResponse = await fetch(expoPushUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: profile.expo_push_token,
        title: "Task waiting for review",
        body: "Open Choro to approve it.",
        sound: "default",
        data: {
          childId,
          taskId,
          url: `/approve-task-modal?childId=${childId}&taskId=${taskId}`,
        },
      }),
    });

    const pushResult = await pushResponse.json();

    if (!pushResponse.ok) {
      return jsonResponse({ error: "Expo push failed", details: pushResult }, 502);
    }

    return jsonResponse({ sent: true, details: pushResult });
  } catch (error) {
    console.log("Notify parent task review error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
