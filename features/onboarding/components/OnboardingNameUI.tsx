import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { totalOnboardingSteps } from "@/lib/constants";
import { useAppDispatch } from "@/store/hooks";
import { updateOnboarding } from "@/store/features/onboarding/onboardingSlice";

export default function OnboardingNameUI() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [childName, setChildName] = useState<string>("");

  const onNextPress = () => {
    dispatch(updateOnboarding({ childName: childName }));
    router.push("/(onboarding)/age");
  };

  return (
    <OnboardingWrapper
      step={1}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
      buttonDisabled={!childName.length}
    >
      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>
            {t("onboarding.name.title")}
          </ThemedText>
          <ThemedText type="subtitle">
            {t("onboarding.name.subtitle")}
          </ThemedText>
        </View>

        <Input
          placeholder={t("onboarding.name.enterName")}
          value={childName}
          onChangeText={setChildName}
        />
      </View>
    </OnboardingWrapper>
  );
}
