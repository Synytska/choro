import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { childrenApi, UpdateTasksPayload } from "../api/children.api";

export function useUpdateTasks() {
  const queryClient = useQueryClient();

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

      // TODO: add to localization
      showSuccessToast("Tasks updated");
    },
    onError: (error) => {
      console.log("Update tasks error:", error);
      // TODO: add to localization
      showErrorToast("Tasks could not be updated. Try again");
    },
  });
}
