import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import i18n from "@/i18n";
import { AppLanguage } from "@/lib/types";

import { settingsApi } from "../api/settings.api";

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (language: AppLanguage) => settingsApi.updateLanguage(language),
    onSuccess: async (profile, language) => {
      await i18n.changeLanguage(language);
      queryClient.setQueryData(["profile"], profile);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast(t("p-dashboard.settings.languageModal.success"));
    },
    onError: (error) => {
      console.log("Update language error:", error);
      showErrorToast(t("p-dashboard.settings.languageModal.error"));
    },
  });
}
