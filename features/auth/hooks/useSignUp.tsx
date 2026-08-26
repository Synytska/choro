import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { logger } from "@/lib/logger";

import { getAuthErrorMessage } from "../auth.errors";
import { type SignupFormData } from "../schemas/loginSchema";

const signUpApi = (data: SignupFormData) =>
  authService.signup(data.email, data.password, data.name);

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpApi,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      showSuccessToast(t("auth.success.signUp"));
      router.replace("/(onboarding)");
    },

    onError: (error) => {
      logger.error("Sign up error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
