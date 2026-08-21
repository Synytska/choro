import { supabase } from "@/lib/supabase";

const CLAIM_CHILD_LEVEL_UP_BONUS_RPC = "claim_child_level_up_bonus";

export type ClaimLevelUpBonusPayload = {
  childId: string;
  loginCode: string;
  level: number;
};

export const levelUpApi = {
  claimLevelUpBonus: async (payload: ClaimLevelUpBonusPayload) => {
    const { data, error } = await supabase
      .rpc(CLAIM_CHILD_LEVEL_UP_BONUS_RPC, {
        input_child_id: payload.childId,
        input_level: payload.level,
        input_login_code: payload.loginCode,
      })
      .single();

    if (error) throw error;

    return data;
  },
};
