import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import i18n from "@/i18n";
import { logger } from "@/lib/logger";
import { normalizeLanguage } from "@/lib/utils/utils";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

import { getAuthErrorMessage } from "../auth.errors";
import { KidLoginFormData } from "../schemas/loginSchema";

const kidLoginApi = (data: KidLoginFormData) => authService.kidLogin(data.parentCode);

export function useKidLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kidLoginApi,

    onSuccess: async (data) => {
      const language = normalizeLanguage(data.profile.language);

      await i18n.changeLanguage(language);
      queryClient.setQueryData(["auth", "session"], {
        kind: "kid",
        ...data,
      });

      dispatch(
        setCredentials({
          user: data.profile,
        }),
      );

      showSuccessToast(t("auth.success.signIn"));
      router.replace("/(role-kid)/(home)");
    },

    onError: (error) => {
      logger.error("Kid sign in error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
