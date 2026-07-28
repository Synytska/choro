import { useMutation, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { NotificationSettingsPayload, settingsApi } from "../api/settings.api";

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotificationSettingsPayload) =>
      settingsApi.updateNotificationSettings(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
      showSuccessToast(t("parent.settings.notificationSettingsSuccess"));
    },
    onError: (error) => {
      console.log("Update notification settings error:", error);
      showErrorToast(t("parent.settings.notificationSettingsError"));
    },
  });
}
