/// <reference path="../deno.d.ts" />

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendPush } from "./sendPush.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export type VerifiedChild = {
  id: string;
  name?: string | null;
  login_code: string;
  family_id: string;
};

type ParentPushTarget =
  | {
      canSend: true;
      token: string;
    }
  | {
      canSend: false;
      reason: string;
    };

export const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

export const optionsResponse = () => new Response("ok", { headers: corsHeaders });

export const createSupabaseAdminClient = (): SupabaseClient => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase function environment");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};

export const getVerifiedChild = async (
  supabase: SupabaseClient,
  {
    childId,
    loginCode,
  }: {
    childId: string;
    loginCode: string;
  },
): Promise<VerifiedChild | null> => {
  const { data: child, error } = await supabase
    .from("children")
    .select("id, name, login_code, family_id")
    .eq("id", childId)
    .eq("login_code", loginCode.trim().toUpperCase())
    .maybeSingle();

  if (error) throw error;

  return child as VerifiedChild | null;
};

export const getParentPushTarget = async (
  supabase: SupabaseClient,
  child: VerifiedChild,
): Promise<ParentPushTarget> => {
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("parent_id")
    .eq("id", child.family_id)
    .maybeSingle();

  if (familyError) throw familyError;

  if (!family?.parent_id) {
    return {
      canSend: false,
      reason: "Parent not found",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("expo_push_token, parent_notifications_enabled")
    .eq("id", family.parent_id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile?.expo_push_token) {
    return {
      canSend: false,
      reason: "Parent push token missing",
    };
  }

  if (profile.parent_notifications_enabled === false) {
    return {
      canSend: false,
      reason: "Parent notifications disabled",
    };
  }

  return {
    canSend: true,
    token: profile.expo_push_token,
  };
};

export const sendParentPush = async ({
  supabase,
  child,
  title,
  body,
  data,
}: {
  supabase: SupabaseClient;
  child: VerifiedChild;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}) => {
  const target = await getParentPushTarget(supabase, child);

  if (!target.canSend) {
    return {
      sent: false,
      reason: target.reason,
    };
  }

  const details = await sendPush({
    token: target.token,
    title,
    body,
    data,
  });

  return {
    sent: true,
    details,
  };
};
