import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/themed-text";
import { LoginFormData, loginSchema } from "../../schemas/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { useTranslation } from "react-i18next";

//TODO: add logic
export default function LoginForm({ isParent = true }: { isParent?: boolean }) {
  // const { mutate: login, isPending } = useLogin();
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

  const onSubmit = (data: LoginFormData) => {
    // login(data);
    console.log("Login data:", data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("emailAddress")}
            placeholder={t("enterEmail")}
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
            label={t("password")}
            placeholder={t("password")}
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            secureTextEntry
          />
        )}
      />

      <TouchableOpacity style={styles.forgotPassword}>
        <ThemedText style={styles.forgotPasswordText}>
          {t("forgotPassword")}
        </ThemedText>
      </TouchableOpacity>

      <Button
        onPress={handleSubmit(onSubmit)}
        // loading={isPending}
      >
        {t("signIn")}
      </Button>

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
});
