import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buttonVariant } from "@/lib/constants";

import { useKidLogin } from "../../hooks/useKidLogin";
import { KidLoginFormData, kidLoginSchema } from "../../schemas/loginSchema";

export default function KidLoginForm() {
  const { t } = useTranslation();
  const kidLogin = useKidLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<KidLoginFormData>({
    resolver: zodResolver(kidLoginSchema),
    defaultValues: {
      parentCode: "",
    },
  });

  const onSubmit = async (data: KidLoginFormData) => {
    kidLogin.mutate({
      parentCode: data.parentCode,
    });
  };

  return (
    <View style={styles.wrapper}>
      <Controller
        control={control}
        name="parentCode"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="kid"
            placeholder={t("auth.kid.enterCode")}
            value={value}
            onChangeText={(text) => onChange(text.replace(/\s/g, "").toUpperCase())}
            error={errors.parentCode?.message}
            autoCapitalize="characters"
            maxLength={6}
          />
        )}
      />

      <Button
        onPress={handleSubmit(onSubmit)}
        variant={buttonVariant.secondary}
        textStyle={styles.buttonText}
        disabled={kidLogin.isPending}
      >
        {t("auth.kid.enterGame")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    gap: 20,
  },
  buttonText: {
    fontSize: 22,
    textTransform: "uppercase",
  },
});
