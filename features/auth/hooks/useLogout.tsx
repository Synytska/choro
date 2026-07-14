import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { showSuccessToast } from "@/components/ui/toast/toast";
import { authService } from "@/features/auth/api/auth-api";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      queryClient.clear();
      router.replace("/(auth)/login/parent-login");

      showSuccessToast("Logout successful");
    },
  });
}
