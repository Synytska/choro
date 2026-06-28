import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { authService } from "@/features/auth/api/auth-api";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      queryClient.clear();
      router.replace("/(auth)/(login-tabs)/parent-login");
    },
  });
}
