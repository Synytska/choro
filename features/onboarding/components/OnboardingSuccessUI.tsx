import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Share, View } from "react-native";
import { useAppColors } from "@/hooks/use-app-colors";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { useTranslation } from "react-i18next";
import { totalOnboardingSteps } from "@/lib/constants";
import CheckIcon from "@/assets/svg-icons/CheckIcon";
import { ThemedText } from "@/components/themed-text";
import { styles } from "./styles";

const childCode = "69HE1B34327";

export default function OnboardingSuccessUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(childCode);
    setIsCopied(true);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Download Do it! and enter this code on your child's phone or tablet: ${childCode}`,
    });
  };

  const onContinuePress = () => {
    // router.push("/(onboarding)/finish");
  };

  return (
    <OnboardingWrapper
      step={5}
      totalSteps={totalOnboardingSteps}
      buttons={[
        {
          title: t("share"),
          onPress: handleShare,
          icon: <Feather name="send" size={20} color={colors.white} />,
        },
        {
          title: t("continue"),
          onPress: onContinuePress,
          variant: "outline",
        },
      ]}
    >
      <View style={[styles.content, styles.successContent]}>
        <ThemedText style={styles.title}>{t("accountCreated")}</ThemedText>
        <CheckIcon style={styles.checkIcon} />
        <View style={styles.codeSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Copy child code"
            onPress={handleCopy}
            style={[styles.codeCard, { backgroundColor: colors.lightGrey }]}
          >
            <ThemedText style={styles.codeText}>
              {t("childCode")} {childCode}
            </ThemedText>
            <Feather
              name={isCopied ? "check" : "copy"}
              size={20}
              color={colors.darkNavy}
            />
          </Pressable>
          <ThemedText type="subtitle">{t("downoloadAppExplain")}</ThemedText>
        </View>
      </View>
    </OnboardingWrapper>
  );
}
