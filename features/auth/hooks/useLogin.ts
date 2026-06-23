import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";

const loginApi = async (data: LoginFormData) => {
  // TODO: Add real API
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Incorrect email or password");
  return response.json();
};

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // TODO: Add logic
      console.log("Login successful:", data);
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
}
