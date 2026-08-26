import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import i18n from "@/i18n";
import { logger } from "@/lib/logger";
import { normalizeLanguage } from "@/lib/utils/utils";

import { getAuthErrorMessage } from "../auth.errors";
import { type LoginFormData } from "../schemas/loginSchema";

const loginApi = (data: LoginFormData) => authService.login(data.email, data.password);

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      const language = normalizeLanguage(data.profile.language);

      await i18n.changeLanguage(language);
      queryClient.setQueryData(["profile"], data.profile);
      queryClient.setQueryData(["auth", "session"], {
        kind: "parent",
        session: data.session,
        user: data.user,
        profile: data.profile,
      });

      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      showSuccessToast(t("auth.success.signIn"));
      router.replace(data.profile.onboarding_completed ? "/(role-parent)" : "/(onboarding)");
    },

    onError: (error) => {
      logger.error("Sign in error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
