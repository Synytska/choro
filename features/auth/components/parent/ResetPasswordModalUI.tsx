/**
 * Password recovery modal opened after the user returns from the Supabase reset link.
 *
 * Lets the user set and confirm a new password for the recovery session.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { role } from "@/lib/constants";

import { useResetPassword } from "../../hooks/useResetPassword";
import { ResetPasswordFormData, resetPasswordSchema } from "../../schemas/loginSchema";
import { styles } from "./styles";

export function ResetPasswordModalUI() {
  const { t } = useTranslation();
  const resetPassword = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(data);
  };

  return (
    <PageView
      modal
      screen={role.auth}
      buttons={[
        {
          title: t("auth.resetPassword.updatePassword"),
          onPress: handleSubmit(onSubmit),
          disabled: resetPassword.isPending,
        },
      ]}
      dismissKeyboardOnPress
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>
            {t("auth.resetPassword.newPasswordTitle")}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.modalSubtitle}>
            {t("auth.resetPassword.newPasswordSubtitle")}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("auth.resetPassword.newPassword")}
                placeholder={t("auth.resetPassword.newPassword")}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("auth.resetPassword.confirmPassword")}
                placeholder={t("auth.resetPassword.confirmPassword")}
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />
        </View>
      </View>
    </PageView>
  );
}
