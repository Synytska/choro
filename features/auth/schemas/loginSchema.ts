import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;

// ====================== PARENT LOGIN ======================
export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, { error: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ====================== PARENT SIGNUP ======================
export const signupSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, { error: "Password must be at least 6 characters" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ====================== KID LOGIN ======================
export const kidLoginSchema = z.object({
  parentCode: z
    .string()
    .min(4, { message: "Parent code must be at least 4 characters" })
    .max(10, { message: "Parent code is too long" })
    .regex(/^[A-Z0-9]+$/, {
      message: "Parent code can only contain uppercase letters and numbers",
    }),
});

export type KidLoginFormData = z.infer<typeof kidLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH, {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
    confirmPassword: z.string().min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
