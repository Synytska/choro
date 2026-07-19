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
      const queriesToInvalidate = [["children", "dashboard"]];

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

      showSuccessToast("Task updated");
    },
    onError: (error) => {
      // TODO: LOcalize
      console.log("Update task status error:", error);
      showErrorToast("Task could not be updated. Try again");
    },
  });
}
