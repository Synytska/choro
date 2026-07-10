import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";

import { useChangePassword } from "../hooks/useChangePassword";
import { ChangePasswordFormData, changePasswordSchema } from "../schemas/changePasswordSchema";

export function ChangePasswordModalUI() {
  const router = useRouter();
  const changePassword = useChangePassword();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onChangePassword = (data: ChangePasswordFormData) => {
    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  return (
    <PageView
      background="parent"
      buttons={[
        {
          title: t("p-dashboard.settings.modal.updatePass"),
          onPress: handleSubmit(onChangePassword),
          disabled: changePassword.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: () => router.back(),
          variant: "outline",
        },
      ]}
      dismissKeyboardOnPress
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("p-dashboard.settings.modal.title")}</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            {t("p-dashboard.settings.modal.subtitle")}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("p-dashboard.settings.modal.label_1")}
                placeholder={t("p-dashboard.settings.modal.placeholder_1")}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                error={errors.currentPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("p-dashboard.settings.modal.label_2")}
                placeholder={t("p-dashboard.settings.modal.placeholder_2")}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                error={errors.newPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("p-dashboard.settings.modal.label_3")}
                placeholder={t("p-dashboard.settings.modal.placeholder_3")}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>
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
  form: {
    gap: 18,
  },
});
