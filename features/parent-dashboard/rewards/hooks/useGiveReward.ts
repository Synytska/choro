import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { GiveRewardPayload, rewardsApi } from "../api/rewards.api";

type UpdatedRewardRow = {
  child_id?: string;
};

export function useGiveReward() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: GiveRewardPayload) => rewardsApi.giveReward(payload),
    onSuccess: async (data, variables) => {
      const reward = data as UpdatedRewardRow;
      const queriesToInvalidate = [
        ["children", "dashboard"],
        ["rewards", "details", variables.rewardId],
      ];

      if (reward.child_id) {
        queriesToInvalidate.push(["child", reward.child_id], ["kid", "dashboard", reward.child_id]);
      }

      await Promise.all(
        queriesToInvalidate.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
          }),
        ),
      );

      showSuccessToast(t("parent.children.giftGivenToast"));
      router.back();
    },
    onError: (error) => {
      console.log("Give reward error:", error);
      showErrorToast(t("parent.children.giftGiveError"));
    },
  });
}
