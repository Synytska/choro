import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { DeleteRewardPayload, rewardsApi } from "../api/rewards.api";

export function useDeleteReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteRewardPayload) => rewardsApi.deleteReward(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["children", "details"],
        }),
      ]);

      showSuccessToast("Reward deleted");
    },
    onError: (error) => {
      console.log("Delete reward error:", error);
      showErrorToast("Reward could not be deleted. Try again");
    },
  });
}
