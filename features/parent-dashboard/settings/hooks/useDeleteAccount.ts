import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { settingsApi } from "../api/settings.api";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/(auth)/(login-tabs)/parent-login");
      showSuccessToast(t("p-dashboard.settings.deleteAccountSuccess"));
    },
    onError: (error) => {
      console.log("Delete account error:", error);
      showErrorToast(t("p-dashboard.settings.deleteAccountError"));
    },
  });
}
