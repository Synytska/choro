import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { useLevelUpCelebration } from "@/features/kid-dashboard/home/hooks/useLevelUpCelebration";
import { logger } from "@/lib/logger";

import { achievementsApi, ClaimAchievementPayload } from "../api/achievements.api";

export function useClaimAchievement() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const levelUpCelebration = useLevelUpCelebration();

  return useMutation({
    mutationFn: (payload: ClaimAchievementPayload) => achievementsApi.claimAchievement(payload),
    onSuccess: async (_data, variables) => {
      const previousLevel = levelUpCelebration.captureLevel(queryClient, variables.childId);

      await queryClient.invalidateQueries({
        queryKey: ["kid", "dashboard", variables.childId],
      });
      await queryClient.refetchQueries({
        queryKey: ["kid", "dashboard", variables.childId],
        type: "active",
      });

      levelUpCelebration.showIfLevelIncreased({
        childId: variables.childId,
        loginCode: variables.loginCode,
        previousLevel,
        queryClient,
      });

      showSuccessToast(t("kid.rewards.achievementClaimedToast"));
      router.back();
    },
    onError: (error) => {
      logger.error("Claim achievement error:", error);
      showErrorToast(t("kid.rewards.achievementClaimError"));
      router.back();
    },
  });
}
