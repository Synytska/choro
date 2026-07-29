import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

import { useLogin } from "../../hooks/useLogin";
import { LoginFormData, loginSchema } from "../../schemas/loginSchema";
import { GoogleAuthButton } from "./GoogleAuthButton";

export default function LoginForm() {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending, reset: resetSignInError } = useLogin();

  const onSignIn = (data: LoginFormData) => {
    resetSignInError();
    login(data);
  };

  return (
    <View style={styles.container}>
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("auth.parent.password")}
            placeholder={t("auth.parent.password")}
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push("/forgot-password-modal")}
      >
        <ThemedText style={styles.forgotPasswordText}>{t("auth.parent.forgotPassword")}</ThemedText>
      </TouchableOpacity>

      <Button onPress={handleSubmit(onSignIn)} loading={isPending} disabled={isPending}>
        {t("auth.parent.signIn")}
      </Button>
      <Separator />
      <GoogleAuthButton disabled={isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: 500,
  },
});
