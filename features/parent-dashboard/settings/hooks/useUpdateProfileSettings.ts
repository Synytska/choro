import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { settingsApi, UpdateProfileSettingsPayload } from "../api/settings.api";

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileSettingsPayload) =>
      settingsApi.updateProfileSettings(payload),
    onSuccess: async (profile) => {
      queryClient.setQueryData(["profile"], profile);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccessToast(t("parent.settings.profileUpdated"));
    },
    onError: (error) => {
      console.log("Update profile settings error:", error);
      showErrorToast(t("parent.settings.profileUpdateError"));
    },
  });
}
