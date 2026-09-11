import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { DeleteTaskPayload, tasksApi } from "../api/tasks.api";

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: DeleteTaskPayload) => tasksApi.deleteTask(payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["child", variables.childId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["kid", "dashboard", variables.childId],
        }),
      ]);

      showSuccessToast(t("common.toasts.taskDeleted"));
    },
    onError: (error) => {
      logger.error("Delete task error:", error);
      showErrorToast(t("common.toasts.taskDeleteError"));
    },
  });
}
