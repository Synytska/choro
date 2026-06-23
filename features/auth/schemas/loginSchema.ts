import { z } from "zod";

// ====================== PARENT LOGIN ======================
export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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
