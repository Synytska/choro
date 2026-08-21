// features/onboarding/hooks/useSaveOnboarding.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { onboardingApi } from "../api/onboarding.api";

export function useSaveOnboarding() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
      logger.error("Onboarding error:", error);
      showErrorToast(t("common.toasts.onboardingError"));
    },
  });
}
