// features/onboarding/hooks/useSaveOnboarding.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { onboardingApi } from "../api/onboarding.api";
import { showErrorToast } from "@/components/ui/toast/toast";

export function useSaveOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.saveOnboarding,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError: (error) => {
      console.log("Onboarding error:", error);
      //TODO: add to localization
      showErrorToast("Onboarding couldnt be completed! Try again");
    },
  });
}
