/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getAuthenticatedUserId,
  jsonResponse,
  optionsResponse,
  sendChildPush,
} from "../_shared/notifications.ts";

type NotifyChildRewardGivenPayload = {
  rewardId?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { rewardId } = (await req.json()) as NotifyChildRewardGivenPayload;

    if (!rewardId) {
      return jsonResponse({ error: "Missing rewardId" }, 400);
    }

    const supabase = createSupabaseAdminClient();
    const parentId = await getAuthenticatedUserId(supabase, req);

    if (!parentId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("id, name, status, child_id")
      .eq("id", rewardId)
      .maybeSingle();

    if (rewardError) throw rewardError;

    if (!reward?.child_id) {
      return jsonResponse({ error: "Reward not found" }, 404);
    }

    if (reward.status !== "given") {
      return jsonResponse({ error: "Reward is not given" }, 409);
    }

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, family_id, expo_push_token, notifications_permission_status")
      .eq("id", reward.child_id)
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
      return jsonResponse({ error: "Reward not found" }, 404);
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
      title: "Reward given",
      body: `${reward.name ?? "Your reward"} is ready. Enjoy!`,
      data: {
        childId: child.id,
        rewardId,
        type: "reward_given",
        url: "/(role-kid)/(rewards)",
      },
    });

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify child reward given error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
