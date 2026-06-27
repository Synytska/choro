import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/themed-text";
import { useSignUp } from "../../hooks/useSignUp";
import { LoginFormData, loginSchema } from "../../schemas/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { useTranslation } from "react-i18next";

export default function LoginForm({ isParent = true }: { isParent?: boolean }) {
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

  const {
    mutate: signup,
    isPending: isSignUpPending,
    reset: resetSignUpError,
  } = useSignUp();

  const isSubmitting = isPending || isSignUpPending;

  const onSignIn = (data: LoginFormData) => {
    resetSignInError();
    resetSignUpError();
    login(data);
    console.log("Login data:", data);
  };

  const onSignUp = (data: LoginFormData) => {
    resetSignInError();
    resetSignUpError();
    signup(data);
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

      <TouchableOpacity style={styles.forgotPassword}>
        <ThemedText style={styles.forgotPasswordText}>
          {t("auth.parent.forgotPassword")}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.actions}>
        <Button
          onPress={handleSubmit(onSignIn)}
          loading={isPending}
          disabled={isSubmitting}
        >
          {t("auth.parent.signIn")}
        </Button>
        <Button
          onPress={handleSubmit(onSignUp)}
          loading={isSignUpPending}
          disabled={isSubmitting}
        >
          {t("auth.parent.signUp")}
        </Button>
      </View>

      {/* <Text>Or</Text> */}
      {/* Google Button */}
      {/* <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity> */}
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
  googleButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#3F3F46",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    color: "#9d0d0d90",
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
});
