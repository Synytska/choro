import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";

import { getAuthErrorMessage } from "../auth.errors";
import { type LoginFormData } from "../schemas/loginSchema";

const signUpApi = (data: LoginFormData) => authService.signup(data.email, data.password);

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpApi,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      showSuccessToast(t("auth.success.signUp"));
      router.replace("/(onboarding)/gender");
    },

    onError: (error) => {
      console.log("Sign up error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
