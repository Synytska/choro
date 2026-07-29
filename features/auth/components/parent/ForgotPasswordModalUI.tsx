/**
 * Password reset request modal for parent auth.
 *
 * Lets a user enter their email so Supabase can send a recovery link.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { buttonVariant, role } from "@/lib/constants";

import { useForgotPassword } from "../../hooks/useForgotPassword";
import { ForgotPasswordFormData, forgotPasswordSchema } from "../../schemas/loginSchema";

export function ForgotPasswordModalUI() {
  const { t } = useTranslation();
  const forgotPassword = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data);
  };

  return (
    <PageView
      modal
      screen={role.auth}
      buttons={[
        {
          title: t("auth.resetPassword.sendLink"),
          onPress: handleSubmit(onSubmit),
          disabled: forgotPassword.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: () => router.back(),
          variant: buttonVariant.outline,
          disabled: forgotPassword.isPending,
        },
      ]}
      dismissKeyboardOnPress
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("auth.resetPassword.title")}</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            {t("auth.resetPassword.subtitle")}
          </ThemedText>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t("auth.parent.emailAddress")}
              placeholder={t("auth.parent.enterEmail")}
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 28,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
});
