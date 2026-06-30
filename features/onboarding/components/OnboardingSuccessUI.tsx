import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Share, View } from "react-native";

import CheckIcon from "@/assets/svg-icons/CheckIcon";
import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { useAppSelector } from "@/store/hooks";
import { selectChildCode, selectChildName } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingSuccessUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const childCode = useAppSelector(selectChildCode);
  const childName = useAppSelector(selectChildName);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(childCode);
    setIsCopied(true);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Download Choro! And enter this code on your child's phone or tablet: ${childCode}`,
    });
  };

  const onContinuePress = () => {
    router.push("/(role-parent)");
  };

  return (
    <OnboardingWrapper
      step={5}
      totalSteps={totalOnboardingSteps}
      hideBackButton
      buttons={[
        {
          title: t("common.share"),
          onPress: handleShare,
          icon: <AppIcon icon={Icons.send} size={20} color={colors.white} />,
        },
        {
          title: t("common.continue"),
          onPress: onContinuePress,
          variant: "outline",
        },
      ]}
    >
      <View style={[styles.content, styles.successContent]}>
        <ThemedText style={styles.title}>
          {t("onboarding.finish.title", { name: childName })}
        </ThemedText>
        <CheckIcon style={styles.checkIcon} />
        <View style={styles.codeSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Copy child code"
            onPress={handleCopy}
            style={[styles.codeCard, { backgroundColor: colors.lightGrey }]}
          >
            <ThemedText style={styles.codeText}>
              {t("onboarding.finish.childCode")} {childCode}
            </ThemedText>
            <AppIcon icon={isCopied ? Icons.check : Icons.copy} size={20} color={colors.darkNavy} />
          </Pressable>
          <ThemedText type="subtitle">{t("onboarding.finish.subtitle")}</ThemedText>
        </View>
      </View>
    </OnboardingWrapper>
  );
}
