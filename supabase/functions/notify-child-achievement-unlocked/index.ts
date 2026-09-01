/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getVerifiedChild,
  jsonResponse,
  optionsResponse,
  sendChildPush,
} from "../_shared/notifications.ts";

type NotifyChildAchievementUnlockedPayload = {
  achievementId?: string;
  childId?: string;
  loginCode?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { achievementId, childId, loginCode } =
      (await req.json()) as NotifyChildAchievementUnlockedPayload;

    if (!achievementId || !childId || !loginCode) {
      return jsonResponse({ error: "Missing achievementId, childId, or loginCode" }, 400);
    }

    const supabase = createSupabaseAdminClient();
    const child = await getVerifiedChild(supabase, { childId, loginCode });

    if (!child) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    const { data: achievement, error: achievementError } = await supabase
      .from("child_achievements")
      .select("id, achievement_id, child_id, unlocked_at, shown_at, claimed_at")
      .eq("child_id", childId)
      .eq("achievement_id", achievementId)
      .maybeSingle();

    if (achievementError) throw achievementError;

    if (!achievement) {
      return jsonResponse({ error: "Achievement not found" }, 404);
    }

    if (achievement.claimed_at) {
      return jsonResponse({
        sent: false,
        reason: "Achievement already claimed",
      });
    }

    if (achievement.shown_at) {
      return jsonResponse({
        sent: false,
        reason: "Achievement already shown",
      });
    }

    const { data: pushChild, error: childError } = await supabase
      .from("children")
      .select("id, name, expo_push_token, notifications_permission_status")
      .eq("id", childId)
      .maybeSingle();

    if (childError) throw childError;

    if (
      pushChild?.notifications_permission_status &&
      pushChild.notifications_permission_status !== "granted"
    ) {
      return jsonResponse({
        sent: false,
        reason: "Child notifications are not granted",
      });
    }

    const result = await sendChildPush({
      token: pushChild?.expo_push_token,
      title: "Achievement unlocked!",
      body: `${pushChild?.name ?? "You"} unlocked a new achievement. Tap to claim it!`,
      data: {
        achievementId,
        childId,
        type: "achievement_unlocked",
        url: `/unlock-achievement-modal?achievementId=${encodeURIComponent(achievementId)}`,
      },
    });

    if (result.sent) {
      const { error: updateError } = await supabase
        .from("child_achievements")
        .update({ shown_at: new Date().toISOString() })
        .eq("id", achievement.id);

      if (updateError) throw updateError;
    }

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify child achievement unlocked error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
