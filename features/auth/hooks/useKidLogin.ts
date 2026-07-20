import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

import { getAuthErrorMessage } from "../auth.errors";
import { KidLoginFormData } from "../schemas/loginSchema";

const kidLoginApi = (data: KidLoginFormData) => authService.kidLogin(data.parentCode);

export function useKidLogin() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: kidLoginApi,

    onSuccess: (data) => {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: data.profile,
        }),
      );

      showSuccessToast(t("auth.success.signIn"));
      router.replace("/(role-kid)/(home)");
    },

    onError: (error) => {
      console.log("Kid sign in error:", error);
      showErrorToast(t(getAuthErrorMessage(error)));
    },
  });
}
