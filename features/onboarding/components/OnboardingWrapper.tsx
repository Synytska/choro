import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AppIcon, Icons } from "@/components/ui/AppIcon";
import PageView from "@/components/ui/PageView";
import { Palette } from "@/constants/theme";
import { FooterButton } from "@/lib/types";

type OnboardingWrapperProps = {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  nextTitle?: string;
  buttons?: FooterButton[];
  buttonDisabled?: boolean;
  hideBackButton?: boolean;
  dismissKeyboard?: boolean;
};

export function OnboardingWrapper({
  children,
  step,
  totalSteps,
  onNext,
  nextTitle,
  buttons,
  buttonDisabled,
  hideBackButton = false,
  dismissKeyboard = false,
}: OnboardingWrapperProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(auth)/login/parent-login");
  };

  const footerButtons: FooterButton[] | undefined =
    buttons ??
    (onNext
      ? [
          {
            title: nextTitle ?? t("common.next"),
            onPress: onNext,
            disabled: buttonDisabled,
          },
        ]
      : undefined);

  return (
    <PageView modal buttons={footerButtons} dismissKeyboardOnPress={dismissKeyboard}>
      <View style={styles.navigationRow}>
        {!hideBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <AppIcon icon={Icons.chevronLeft} size={24} color={Palette.white} />
          </TouchableOpacity>
        )}

        <View style={styles.stepIndicator}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[styles.step, index === step ? styles.activeStep : styles.inactiveStep]}
            />
          ))}
        </View>
      </View>

      {children}
    </PageView>
  );
}

const styles = StyleSheet.create({
  navigationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: Palette.orange,
  },
  stepIndicator: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingTop: 20,
  },
  step: {
    height: 8,
    borderRadius: 4,
  },
  activeStep: {
    width: 24,
    backgroundColor: Palette.orange,
  },
  inactiveStep: {
    width: 8,
    backgroundColor: Palette.middleGrey,
  },
});
