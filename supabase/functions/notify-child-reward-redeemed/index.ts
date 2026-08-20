/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getVerifiedChild,
  jsonResponse,
  optionsResponse,
  sendParentPush,
} from "../_shared/notifications.ts";

type NotifyRewardRedeemedPayload = {
  childId?: string;
  loginCode?: string;
  rewardId?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { childId, loginCode, rewardId } = (await req.json()) as NotifyRewardRedeemedPayload;

    if (!childId || !loginCode || !rewardId) {
      return jsonResponse({ error: "Missing childId, loginCode or rewardId" }, 400);
    }

    const supabase = createSupabaseAdminClient();
    const child = await getVerifiedChild(supabase, { childId, loginCode });

    if (!child) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("id, child_id, name, status")
      .eq("id", rewardId)
      .eq("child_id", childId)
      .maybeSingle();

    if (rewardError) throw rewardError;

    if (!reward || reward.status !== "requested") {
      return jsonResponse({ error: "Reward is not waiting to be given" }, 409);
    }

    const result = await sendParentPush({
      supabase,
      child,
      title: "Reward requested",
      body: `${child.name ?? "Your child"} asked for ${reward.name ?? "a reward"}.`,
      data: {
        childId,
        rewardId,
        type: "reward_requested",
        url: `/give-gift-modal?childId=${childId}&rewardId=${rewardId}`,
      },
    });

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify parent reward request error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
