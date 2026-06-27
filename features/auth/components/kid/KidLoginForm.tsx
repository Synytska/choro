import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Fonts } from "@/constants/theme";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KidLoginFormData, kidLoginSchema } from "../../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export default function KidLoginForm() {
  const { t } = useTranslation();

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

  const onSubmit = async () => {
    console.log("TEST");
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
            onChangeText={onChange}
            error={errors.parentCode?.message}
            autoCapitalize="characters"
            maxLength={6}
          />
        )}
      />

      <Button
        onPress={handleSubmit(onSubmit)}
        variant="secondary"
        textStyle={styles.buttonText}
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
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: 800,
    textTransform: "uppercase",
  },
});
