/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getAuthenticatedUserId,
  jsonResponse,
  optionsResponse,
  sendChildPush,
} from "../_shared/notifications.ts";

type NotifyChildTaskApprovedPayload = {
  taskId?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { taskId } = (await req.json()) as NotifyChildTaskApprovedPayload;

    if (!taskId) {
      return jsonResponse({ error: "Missing taskId" }, 400);
    }

    const supabase = createSupabaseAdminClient();
    const parentId = await getAuthenticatedUserId(supabase, req);

    if (!parentId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: task, error: taskError } = await supabase
      .from("child_tasks")
      .select("id, title, status, child_id")
      .eq("id", taskId)
      .maybeSingle();

    if (taskError) throw taskError;

    if (!task?.child_id) {
      return jsonResponse({ error: "Task not found" }, 404);
    }

    if (task.status !== "done") {
      return jsonResponse({ error: "Task is not approved" }, 409);
    }

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, family_id, expo_push_token, notifications_permission_status")
      .eq("id", task.child_id)
      .maybeSingle();

    if (childError) throw childError;

    if (!child?.family_id) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    const { data: family, error: familyError } = await supabase
      .from("families")
      .select("parent_id")
      .eq("id", child.family_id)
      .maybeSingle();

    if (familyError) throw familyError;

    if (family?.parent_id !== parentId) {
      return jsonResponse({ error: "Task not found" }, 404);
    }

    if (
      child.notifications_permission_status &&
      child.notifications_permission_status !== "granted"
    ) {
      return jsonResponse({
        sent: false,
        reason: "Child notifications are not granted",
      });
    }

    const result = await sendChildPush({
      token: child.expo_push_token,
      title: "Task approved",
      body: `${task.title ?? "Your task"} was approved. Nice work!`,
      data: {
        childId: child.id,
        taskId,
        type: "task_approved",
        url: "/(role-kid)/(tasks)",
      },
    });

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify child task approved error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
