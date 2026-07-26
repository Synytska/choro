import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { logout } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function useKidLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
      router.replace("/(auth)/kid-login");
      showSuccessToast(t("common.toasts.logoutSuccess"));
    },
    onError: (error) => {
      console.log("Kid logout error:", error);
      showErrorToast(t("common.toasts.logoutError"));
    },
  });
}
