import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { childrenApi, UpdateChildPayload } from "../api/children.api";

export function useUpdateChild() {
  const queryClient = useQueryClient();

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

      // TODO: add to localization
      showSuccessToast("Child updated");
    },
    onError: (error) => {
      console.log("Update child error:", error);
      // TODO: add to localization
      showErrorToast("Child could not be updated. Try again");
    },
  });
}
