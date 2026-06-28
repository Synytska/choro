import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import PageView from "@/components/ui/PageView";
import { useAppColors } from "@/hooks/use-app-colors";
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
}: OnboardingWrapperProps) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    activeStep: {
      backgroundColor: colors.darkNavy,
    },
    backButton: {
      backgroundColor: colors.darkNavy,
    },
    inactiveStep: {
      backgroundColor: colors.middleGrey,
    },
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(auth)/parent-login");
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
    <PageView buttons={footerButtons} dismissKeyboardOnPress>
      <View style={styles.navigationRow}>
        {!hideBackButton && (
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, dynamicStyles.backButton]}
          >
            <Feather name="chevron-left" size={24} color={colors.white} />
          </TouchableOpacity>
        )}

        <View style={styles.stepIndicator}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.step,
                index === step
                  ? [styles.activeStep, dynamicStyles.activeStep]
                  : [styles.inactiveStep, dynamicStyles.inactiveStep],
              ]}
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
  },
  inactiveStep: {
    width: 8,
  },
});
