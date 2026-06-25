import { useMutation } from "@tanstack/react-query";
import { type LoginFormData } from "../schemas/loginSchema";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/auth";

const loginApi = async (data: LoginFormData) => {
  const { data: result, error } = await authService.login(
    data.email,
    data.password,
  );

  if (error) throw error;

  return result;
};

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,

    onSuccess: async (data) => {
      console.log("Login successful:", data);

      const user = data.user;

      if (!user) return;

      // optional: отримати profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("PROFILE:", profile);
    },

    onError: (error: any) => {
      console.error("Login error:", error.message);
    },
  });
}
