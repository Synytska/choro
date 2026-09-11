import { z } from "zod";

const MIN_CHILDNAME_LENGTH = 2;

// ====================== Add Child ======================
export const addChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_CHILDNAME_LENGTH, { error: "Child name must be at least 2 characters" }),
  age: z
    .string()
    .trim()
    .regex(/^\d+$/, { error: "Age must be a valid number" })
    .refine((value) => Number(value) > 0, { error: "Age must be more than 0" }),
});

export type AddChildFormData = z.infer<typeof addChildSchema>;
