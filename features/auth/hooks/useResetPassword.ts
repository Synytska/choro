import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { logger } from "@/lib/logger";

import { ResetPasswordFormData } from "../schemas/loginSchema";

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => authService.resetPassword(data.password),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });

      showSuccessToast(t("auth.resetPassword.passwordUpdatedToast"));
      router.replace("/(auth)/login/parent-login");
    },
    onError: (error) => {
      logger.error("Reset password error:", error);
      showErrorToast(t("auth.resetPassword.passwordUpdateError"));
    },
  });
}
