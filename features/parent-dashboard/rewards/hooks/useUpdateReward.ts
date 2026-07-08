import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { rewardsApi, UpdateRewardPayload } from "../api/rewards.api";

export function useUpdateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRewardPayload) => rewardsApi.updateReward(payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["children", "details"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["rewards", "details", variables.rewardId],
        }),
      ]);

      showSuccessToast("Reward updated");
    },
    onError: (error) => {
      console.log("Update reward error:", error);
      showErrorToast("Reward could not be updated. Try again");
    },
  });
}
