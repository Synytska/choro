import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { getLanguageOption } from "@/lib/utils/utils";

import { styles } from "../styles";

type SettingsRowType = {
  title: string;
  icon: (typeof Icons)[keyof typeof Icons];
  onPress?: () => void;
  rightContent?: ReactNode;
  destructive?: boolean;
  showDivider?: boolean;
};

function SettingsRow({
  icon,
  onPress,
  title,
  rightContent,
  showDivider = true,
  destructive,
}: SettingsRowType) {
  const colors = useAppColors();

  const contentColor = destructive ? colors.error : colors.darkNavy;

  const dynamicStyles = StyleSheet.create({
    appSettingsWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGrey,
      paddingBottom: 12,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.appSettingsWrapper, showDivider && dynamicStyles.appSettingsWrapper]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.commonWrapper}>
        <AppIcon icon={icon} size={22} color={contentColor} />
        <ThemedText style={[styles.title, destructive && { color: colors.error }]}>
          {title}
        </ThemedText>
      </View>
      {rightContent}
    </TouchableOpacity>
  );
}

export function AppSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();
  const { data: profile } = useProfile();

  const [childNotificationsEnabled, setChildNotificationsEnabled] = useState(true);
  const [parentNotificationsEnabled, setParentNotificationsEnabled] = useState(true);

  const selectedLanguage = getLanguageOption(profile?.language);

  return (
    <View style={styles.contentWrapper}>
      <ThemedText style={styles.sectionHeader}>{t("p-dashboard.settings.appSettings")}</ThemedText>

      <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
        <SettingsRow
          title={t("p-dashboard.settings.childNotif")}
          icon={Icons.notification}
          rightContent={
            <CustomSwitch
              value={childNotificationsEnabled}
              onValueChange={setChildNotificationsEnabled}
            />
          }
        />

        <SettingsRow
          title={t("p-dashboard.settings.parentNotif")}
          icon={Icons.notification}
          rightContent={
            <CustomSwitch
              value={parentNotificationsEnabled}
              onValueChange={setParentNotificationsEnabled}
            />
          }
        />

        <SettingsRow
          title={t("p-dashboard.settings.language")}
          icon={Icons.language}
          rightContent={
            <View style={styles.commonWrapper}>
              <ThemedText>{selectedLanguage.nativeLabel}</ThemedText>
              <AppIcon icon={Icons.chevronRight} />
            </View>
          }
          onPress={() => router.push("/language-modal")}
        />

        <SettingsRow
          title={t("p-dashboard.settings.logout")}
          icon={Icons.logout}
          destructive
          onPress={() => logout()}
        />

        <SettingsRow
          title={t("p-dashboard.settings.deleteAccount")}
          icon={Icons.bin}
          destructive
          showDivider={false}
          onPress={() => {}}
        />
      </ThemedView>
    </View>
  );
}
