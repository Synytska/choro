import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { CreateTaskPayload, tasksApi } from "../api/tasks.api";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["children", "dashboard"],
      });

      showSuccessToast("Task created");
    },
    onError: (error) => {
      logger.error("Create task error:", error);
      showErrorToast("Task could not be created. Try again");
    },
  });
}
