import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { totalOnboardingSteps } from "@/lib/constants";
import { genders, updateOnboarding } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingGenderUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");

  const border = useThemeColor({ light: Palette.darkNavy, dark: Palette.white }, "border");

  const onNextPress = () => {
    dispatch(updateOnboarding({ childGender: selectedGender }));
    router.push("/(onboarding)/name");
  };

  return (
    <OnboardingWrapper step={0} totalSteps={totalOnboardingSteps} onNext={onNextPress}>
      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>{t("onboarding.gender.title")}</ThemedText>
          <ThemedText type="subtitle">{t("onboarding.gender.subtitle")}</ThemedText>
        </View>

        <View style={styles.genderOptions}>
          {genders.map((gender) => {
            const isSelected = selectedGender === gender;

            return (
              <Pressable
                key={gender}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedGender(gender)}
                style={[
                  styles.genderOption,
                  { borderColor: border },
                  isSelected && styles.selectedGenderOption,
                ]}
              >
                <ThemedText
                  style={[styles.genderOptionText, isSelected && styles.selectedGenderOptionText]}
                >
                  {t(`onboarding.gender.${gender}`)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingWrapper>
  );
}
