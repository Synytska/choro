import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";

import { getAuthErrorMessage } from "../auth.errors";
import { type LoginFormData } from "../schemas/loginSchema";

const loginApi = (data: LoginFormData) => authService.login(data.email, data.password);

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      queryClient.setQueryData(["profile"], data.profile);

      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      showSuccessToast(t("auth.success.signIn"));
      router.replace(data.profile.onboarding_completed ? "/(role-parent)" : "/(onboarding)/gender");
    },

    onError: (error) => {
      console.log("Sign in error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
