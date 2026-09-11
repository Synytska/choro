import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { ChangePasswordPayload, settingsApi } from "../api/settings.api";

export function useChangePassword() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => settingsApi.changePassword(payload),
    onSuccess: () => {
      showSuccessToast(t("parent.settings.passwordUpdated"));
    },
    onError: (error) => {
      logger.error("Change password error:", error);
      showErrorToast(
        error instanceof Error ? error.message : t("parent.settings.passwordUpdateError"),
      );
    },
  });
}
