import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";

import { styles } from "../styles";
import { SettingsRow } from "./SettingsRow";

export function Support() {
  const { t } = useTranslation();

  const supportOptions = [
    {
      id: "contact",
      title: "Contact Us",
      icon: Icons.chat,
      onPress: () => {},
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: Icons.safety,
      onPress: () => {},
    },
    {
      id: "terms",
      title: "Terms",
      icon: Icons.document,
      onPress: () => {},
    },
    {
      id: "feedback",
      title: "Leave feedback in AppStore",
      icon: Icons.star,
      onPress: () => {},
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
