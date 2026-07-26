import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { childrenApi, UpdateChildPayload } from "../api/children.api";

export function useUpdateChild() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: childrenApi.updateChild,
    onSuccess: async (_, variables: UpdateChildPayload) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["child", variables.id],
        }),
      ]);

      showSuccessToast(t("common.toasts.childUpdated"));
    },
    onError: (error) => {
      console.log("Update child error:", error);
      showErrorToast(t("common.toasts.childUpdateError"));
    },
  });
}
