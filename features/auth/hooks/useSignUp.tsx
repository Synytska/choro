import { authService } from "@/features/auth/api/auth-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { type LoginFormData } from "../schemas/loginSchema";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { t } from "i18next";
import { getAuthErrorMessage } from "../auth.errors";

const signUpApi = (data: LoginFormData) =>
  authService.signup(data.email, data.password);

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
