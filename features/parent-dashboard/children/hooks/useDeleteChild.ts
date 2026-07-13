import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast";

import { childrenApi, DeleteChildPayload } from "../api/children.api";

export function useDeleteChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteChildPayload) => childrenApi.deleteChild(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["children", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["children", "details"],
        }),
      ]);

      showSuccessToast("Child deleted");
    },
    onError: (error) => {
      console.log("Delete child error:", error);
      showErrorToast("Child could not be deleted. Try again");
    },
  });
}
