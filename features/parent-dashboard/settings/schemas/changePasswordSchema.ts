import { t } from "i18next";
import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: t("parent.settings.errors.currentPassError") }),
    newPassword: z.string().min(MIN_PASSWORD_LENGTH, {
      error: t("parent.settings.errors.newPassError", { length: MIN_PASSWORD_LENGTH }),
    }),
    confirmPassword: z.string().min(1, { error: t("parent.settings.errors.confirmPassError") }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: t("parent.settings.errors.newPassError_2"),
    path: ["newPassword"],
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: t("parent.settings.errors.passDontMatch"),
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
