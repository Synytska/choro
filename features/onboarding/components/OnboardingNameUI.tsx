import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import { totalOnboardingSteps } from "@/lib/constants";
import { updateOnboarding } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

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
          <ThemedText style={styles.title}>{t("onboarding.name.title")}</ThemedText>
          <ThemedText type="subtitle">{t("onboarding.name.subtitle")}</ThemedText>
        </View>

        <Input placeholder={t("common.enterName")} value={childName} onChangeText={setChildName} />
      </View>
    </OnboardingWrapper>
  );
}
