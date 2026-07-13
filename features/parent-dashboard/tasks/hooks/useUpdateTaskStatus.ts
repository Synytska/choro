import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { tasksApi, UpdateTaskStatusPayload } from "../api/tasks.api";

type UpdatedTaskRow = {
  child_id?: string;
};

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskStatusPayload) => tasksApi.updateTaskStatus(payload),
    onSuccess: async (data) => {
      const updatedTask = data as UpdatedTaskRow;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        updatedTask.child_id
          ? queryClient.invalidateQueries({
              queryKey: ["child", updatedTask.child_id],
            })
          : Promise.resolve(),
      ]);

      showSuccessToast("Task updated");
    },
    onError: (error) => {
      console.log("Update task status error:", error);
      showErrorToast("Task could not be updated. Try again");
    },
  });
}
