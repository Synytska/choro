import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { RequestRewardPayload, rewardsApi } from "../api/rewards.api";

export function useRequestReward() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: RequestRewardPayload) => rewardsApi.requestReward(payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["kid", "dashboard", variables.childId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["child", variables.childId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
      ]);

      showSuccessToast(t("kid.rewards.rewardRequested"));
    },
    onError: (error) => {
      console.log("Request reward error:", error);
      showErrorToast(t("kid.rewards.rewardRequestError"));
    },
  });
}
