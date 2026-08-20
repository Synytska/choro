import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import {
  androidPackageName,
  appStoreId,
  privacyPolicyUrl,
  supportEmail,
  termsOfUseUrl,
} from "@/lib/constants";

import { styles } from "../styles";
import { SettingsRow } from "./SettingsRow";

export function Support() {
  const { t } = useTranslation();

  const openExternalUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert(t("parent.settings.supportErrorTitle"), t("parent.settings.supportErrorMessage"));
      return;
    }

    await Linking.openURL(url);
  };

  const openSupportEmail = (subjectKey: string) => {
    const subject = encodeURIComponent(t(subjectKey));
    const body = encodeURIComponent(t("parent.settings.supportEmailBody"));

    void openExternalUrl(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  const openStoreFeedback = () => {
    if (Platform.OS === "ios" && appStoreId) {
      void openExternalUrl(`itms-apps://itunes.apple.com/app/id${appStoreId}?action=write-review`);
      return;
    }

    if (Platform.OS === "android" && androidPackageName) {
      void openExternalUrl(`market://details?id=${androidPackageName}`);
      return;
    }

    openSupportEmail("parent.settings.supportOptions.feedbackEmailSubject");
  };

  const supportOptions = [
    {
      id: "contact",
      title: t("parent.settings.supportOptions.contact"),
      icon: Icons.chat,
      onPress: () => openSupportEmail("parent.settings.supportOptions.contactEmailSubject"),
    },
    {
      id: "privacy",
      title: t("parent.settings.supportOptions.privacy"),
      icon: Icons.safety,
      onPress: () => void openExternalUrl(privacyPolicyUrl),
    },
    {
      id: "terms",
      title: t("parent.settings.supportOptions.terms"),
      icon: Icons.document,
      onPress: () => void openExternalUrl(termsOfUseUrl),
    },
    {
      id: "feedback",
      title: t("parent.settings.supportOptions.feedback"),
      icon: Icons.star,
      onPress: openStoreFeedback,
    },
  ];

  return (
    <View style={styles.contentWrapper}>
      <ThemedText style={styles.sectionHeader}>{t("parent.settings.support")}</ThemedText>

      <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
        {supportOptions.map((option, index) => (
          <SettingsRow
            key={option.id}
            title={option.title}
            icon={option.icon}
            onPress={option.onPress}
            showDivider={index !== supportOptions.length - 1}
          />
        ))}
      </ThemedView>
    </View>
  );
}
