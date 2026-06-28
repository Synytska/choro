import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useSignUp } from "../../hooks/useSignUp";
import { SignupFormData, signupSchema } from "../../schemas/loginSchema";

export default function SignUpForm() {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signup, isPending: isSignUpPending, reset: resetSignUpError } = useSignUp();

  const onSignUp = (data: SignupFormData) => {
    resetSignUpError();
    signup(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("auth.parent.fullName")}
            placeholder={t("auth.parent.enterName")}
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />
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
      <Button onPress={handleSubmit(onSignUp)} loading={isSignUpPending} disabled={isSignUpPending}>
        {t("auth.parent.signUp")}
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
