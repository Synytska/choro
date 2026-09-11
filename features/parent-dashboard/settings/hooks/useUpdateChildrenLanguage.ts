import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";
import { AppLanguage } from "@/lib/types";

import { settingsApi } from "../api/settings.api";

export function useUpdateChildrenLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (language: AppLanguage) => settingsApi.updateChildrenLanguage(language),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["children", "dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["child"] }),
        queryClient.invalidateQueries({ queryKey: ["kid", "dashboard"] }),
      ]);
      showSuccessToast(t("parent.settings.languageModal.success"));
    },
    onError: (error) => {
      logger.error("Update children language error:", error);
      showErrorToast(t("parent.settings.languageModal.error"));
    },
  });
}
