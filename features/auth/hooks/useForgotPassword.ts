import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { logger } from "@/lib/logger";

import { ForgotPasswordFormData } from "../schemas/loginSchema";

export function useForgotPassword() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.sendPasswordResetEmail(data.email),
    onSuccess: () => {
      showSuccessToast(t("auth.resetPassword.emailSentToast"));
      router.back();
    },
    onError: (error) => {
      logger.error("Forgot password error:", error);
      showErrorToast(t("auth.resetPassword.emailSendError"));
    },
  });
}
