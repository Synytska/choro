import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { childrenApi, UpdateTasksPayload } from "../api/children.api";

export function useUpdateTasks() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: childrenApi.updateTasks,
    onSuccess: async (_, variables: UpdateTasksPayload) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["child", variables.id],
        }),
      ]);

      showSuccessToast(t("common.toasts.tasksUpdated"));
    },
    onError: (error) => {
      logger.error("Update tasks error:", error);
      showErrorToast(t("common.toasts.tasksUpdateError"));
    },
  });
}
