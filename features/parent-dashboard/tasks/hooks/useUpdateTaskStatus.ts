import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { useLevelUpCelebration } from "@/features/kid-dashboard/home/hooks/useLevelUpCelebration";

import { tasksApi, UpdateTaskStatusPayload } from "../api/tasks.api";

type UpdatedTaskRow = {
  child_id?: string;
};

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const levelUpCelebration = useLevelUpCelebration();

  return useMutation({
    mutationFn: (payload: UpdateTaskStatusPayload) => tasksApi.updateTaskStatus(payload),
    onSuccess: async (data) => {
      const updatedTask = data as UpdatedTaskRow;
      const queriesToInvalidate = [["children", "dashboard"]];
      const previousLevel = levelUpCelebration.captureLevel(queryClient, updatedTask.child_id);

      if (updatedTask.child_id) {
        queriesToInvalidate.push(
          ["child", updatedTask.child_id],
          ["kid", "dashboard", updatedTask.child_id],
        );
      }

      await Promise.all(
        queriesToInvalidate.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
          }),
        ),
      );

      if (updatedTask.child_id) {
        await queryClient.refetchQueries({
          queryKey: ["kid", "dashboard", updatedTask.child_id],
          type: "active",
        });
      }

      levelUpCelebration.showIfLevelIncreased({
        childId: updatedTask.child_id,
        previousLevel,
        queryClient,
      });

      showSuccessToast(t("common.toasts.taskUpdated"));
    },
    onError: (error) => {
      console.log("Update task status error:", error);
      showErrorToast(t("common.toasts.taskUpdateError"));
    },
  });
}
