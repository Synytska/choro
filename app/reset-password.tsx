import { router, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import { LogoLoader } from "@/components/ui/LogoLoader";
import { showErrorToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";

export default function ResetPasswordCallback() {
  const params = useGlobalSearchParams();
  const { t } = useTranslation();

  useEffect(() => {
    const completeRecovery = async () => {
      try {
        const paramsObject = Object.entries(params).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (typeof value === "string") {
              acc[key] = value;
            }

            return acc;
          },
          {},
        );
        const queryString = new URLSearchParams(paramsObject).toString();
        const initialUrl = await Linking.getInitialURL();
        const recoveryUrl =
          queryString.length > 0
            ? `myapp://reset-password?${queryString}`
            : initialUrl || "myapp://reset-password";

        await authService.completePasswordRecovery(recoveryUrl);
        router.replace("/reset-password-modal");
      } catch (error) {
        console.log("Password recovery callback error:", error);
        showErrorToast(t("auth.resetPassword.invalidLink"));
        router.replace("/(auth)/login/parent-login");
      }
    };

    completeRecovery();
  }, [params, t]);

  return <LogoLoader />;
}
