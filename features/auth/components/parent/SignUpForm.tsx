import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";

import { useSignUp } from "../../hooks/useSignUp";
import { SignupFormData, signupSchema } from "../../schemas/loginSchema";
import { AppleAuthButton } from "./AppleAuthButton";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { styles } from "./styles";

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
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t("auth.parent.fullName")}
            placeholder={t("auth.parent.enterYourName")}
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
      <Separator />
      <View style={styles.oautWrapper}>
        <AppleAuthButton disabled={isSignUpPending} />
        <GoogleAuthButton disabled={isSignUpPending} />
      </View>
    </View>
  );
}
