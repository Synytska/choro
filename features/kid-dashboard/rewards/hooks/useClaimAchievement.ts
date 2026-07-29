import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { achievementsApi, ClaimAchievementPayload } from "../api/achievements.api";

export function useClaimAchievement() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ClaimAchievementPayload) => achievementsApi.claimAchievement(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["kid", "dashboard", variables.childId],
      });

      showSuccessToast(t("kid.rewards.achievementClaimedToast"));
      router.back();
    },
    onError: (error) => {
      console.log("Claim achievement error:", error);
      showErrorToast(t("kid.rewards.achievementClaimError"));
    },
  });
}
