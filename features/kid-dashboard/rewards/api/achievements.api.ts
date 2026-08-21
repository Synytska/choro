import { supabase } from "@/lib/supabase";

const CLAIM_CHILD_ACHIEVEMENT_RPC = "claim_child_achievement";

export type ClaimAchievementPayload = {
  childId: string;
  loginCode: string;
  achievementId: string;
};

export const achievementsApi = {
  claimAchievement: async (payload: ClaimAchievementPayload) => {
    const { data, error } = await supabase
      .rpc(CLAIM_CHILD_ACHIEVEMENT_RPC, {
        input_achievement_id: payload.achievementId,
        input_child_id: payload.childId,
        input_login_code: payload.loginCode,
      })
      .single();

    if (error) throw error;

    return data;
  },
};
