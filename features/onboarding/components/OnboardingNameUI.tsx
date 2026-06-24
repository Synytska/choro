import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { totalOnboardingSteps } from "@/lib/constants";

export default function OnboardingNameUI() {
  const router = useRouter();
  const { t } = useTranslation();

  const [childName, setChildName] = useState<string>("");

  const onNextPress = () => {
    router.push("/(onboarding)/age");
  };

  return (
    <OnboardingWrapper
      step={1}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
    >
      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>{t("childName")}</ThemedText>
          <ThemedText type="subtitle">{t("childNameExplain")}</ThemedText>
        </View>

        <Input
          placeholder={t("enterName")}
          value={childName}
          onChangeText={setChildName}
        />
      </View>
    </OnboardingWrapper>
  );
}
