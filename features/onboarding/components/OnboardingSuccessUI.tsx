import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Share } from "react-native";

import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { ChildCreateSuccess } from "@/components/ui/ChildCreateSuccess";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { useAppSelector } from "@/store/hooks";
import { selectChildCode, selectChildName } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";

export default function OnboardingSuccessUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const childCode = useAppSelector(selectChildCode);
  const childName = useAppSelector(selectChildName);

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
      <ChildCreateSuccess childName={childName} childCode={childCode} />
    </OnboardingWrapper>
  );
}
