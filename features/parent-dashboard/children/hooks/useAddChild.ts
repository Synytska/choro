import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { showErrorToast } from "@/components/ui/toast/toast";
import { logger } from "@/lib/logger";

import { childrenApi } from "../api/children.api";

export function useAddChild() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: childrenApi.addChild,
    onSuccess: async (data) => {
      queryClient.setQueryData(["children", "lastCreatedChildId"], data.child.id);

      await queryClient.invalidateQueries({
        queryKey: ["children", "dashboard"],
      });
    },
    onError: (error) => {
      logger.error("Add child error:", error);
      showErrorToast(t("common.toasts.childAddError"));
    },
  });
}
