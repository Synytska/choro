import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { Stepper } from "@/components/ui/Stepper";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { updateOnboarding } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingAgeUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [childAge, setChildAge] = useState<number>(0);

  const dynamicStyles = StyleSheet.create({
    button: {
      borderColor: colors.middleGrey,
      backgroundColor: colors.darkNavy,
    },
  });

  const onNextPress = () => {
    dispatch(updateOnboarding({ childAge: childAge }));
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
      buttonDisabled={childAge === 0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{t("onboarding.age.title")}</Text>

        <Stepper
          decrease={decrease}
          increase={increase}
          value={childAge}
          style={styles.buttonsWrapper}
          buttonSize={56}
          iconSize={24}
          valueStyle={styles.ageText}
        />
      </View>
    </OnboardingWrapper>
  );
}
