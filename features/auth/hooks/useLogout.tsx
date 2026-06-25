import { authService } from "@/features/auth/api/auth-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      queryClient.clear();
      router.replace("/(auth)/parent-login");
    },
  });
}
