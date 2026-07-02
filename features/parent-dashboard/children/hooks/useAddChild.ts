import { useMutation, useQueryClient } from "@tanstack/react-query";

import { showErrorToast } from "@/components/ui/toast/toast";

import { childrenApi } from "../api/children.api";

export function useAddChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: childrenApi.addChild,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["children", "dashboard"],
      });
    },
    onError: (error) => {
      console.log("Add child error:", error);
      // TODO: add to localization
      showErrorToast("Child could not be added. Try again");
    },
  });
}
