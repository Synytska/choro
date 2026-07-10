import { useMutation } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { ChangePasswordPayload, settingsApi } from "../api/settings.api";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => settingsApi.changePassword(payload),
    onSuccess: () => {
      showSuccessToast("Password updated");
    },
    // TODO: Addtext to localixarion
    onError: (error) => {
      console.log("Change password error:", error);
      showErrorToast(error instanceof Error ? error.message : "Password could not be updated");
    },
  });
}
