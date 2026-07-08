import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { CreateRewardPayload, rewardsApi } from "../api/rewards.api";

export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRewardPayload) => rewardsApi.createReward(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["children", "details"],
        }),
      ]);

      showSuccessToast("Reward created");
    },
    onError: (error) => {
      console.log("Create reward error:", error);
      showErrorToast("Reward could not be created. Try again");
    },
  });
}
