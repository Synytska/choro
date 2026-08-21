import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { logger } from "@/lib/logger";

import { getAuthErrorMessage } from "../auth.errors";

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signInWithGoogle,

    onSuccess: async (data) => {
      queryClient.setQueryData(["profile"], data.profile);

      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      showSuccessToast(t("auth.success.signIn"));
      router.replace(data.profile.onboarding_completed ? "/(role-parent)" : "/(onboarding)");
    },

    onError: (error) => {
      logger.error("Google auth error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
