import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { ThemedText } from "@/components/themed-text";
import MinusIcon from "@/assets/svg-icons/MinusIcon";
import PlusIcon from "@/assets/svg-icons/PlusIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { totalOnboardingSteps } from "@/lib/constants";

export default function OnboardingAgeUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const [childAge, setChildAge] = useState<number>(0);

  const dynamicStyles = StyleSheet.create({
    button: {
      borderColor: colors.middleGrey,
      backgroundColor: colors.darkNavy,
    },
  });

  const onNextPress = () => {
    router.push("/(onboarding)/interests");
  };

  const increase = () => {
    setChildAge((prev) => prev + 1);
  };

  const decrease = () => {
    setChildAge((prev) => Math.max(0, prev - 1));
  };

  return (
    <OnboardingWrapper
      step={2}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t("howOld")}</Text>

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            onPress={decrease}
            style={[styles.button, dynamicStyles.button]}
          >
            <MinusIcon color={colors.white} />
          </TouchableOpacity>

          <ThemedText style={styles.ageText}>{childAge}</ThemedText>

          <TouchableOpacity
            onPress={increase}
            style={[styles.button, dynamicStyles.button]}
          >
            <PlusIcon color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingWrapper>
  );
}
