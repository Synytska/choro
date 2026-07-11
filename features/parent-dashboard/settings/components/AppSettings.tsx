import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { globalStyles } from "@/features/styles";
import { getLanguageOption } from "@/lib/utils/utils";

import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useUpdateNotificationSettings } from "../hooks/useUpdateNotificationSettings";
import { styles } from "../styles";
import { SettingsRow } from "./SettingsRow";

export function AppSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();
  const { data: profile } = useProfile();
  const deleteAccount = useDeleteAccount();
  const updateNotificationSettings = useUpdateNotificationSettings();

  const [childNotificationsEnabled, setChildNotificationsEnabled] = useState(true);
  const [parentNotificationsEnabled, setParentNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!profile) return;

    setChildNotificationsEnabled(profile.child_notifications_enabled ?? true);
    setParentNotificationsEnabled(profile.parent_notifications_enabled ?? true);
  }, [profile]);

  const selectedLanguage = getLanguageOption(profile?.language);

  const handleChildNotificationsChange = (value: boolean) => {
    const previousValue = childNotificationsEnabled;
    setChildNotificationsEnabled(value);

    updateNotificationSettings.mutate(
      { childNotificationsEnabled: value },
      {
        onError: () => setChildNotificationsEnabled(previousValue),
      },
    );
  };

  const handleParentNotificationsChange = (value: boolean) => {
    const previousValue = parentNotificationsEnabled;
    setParentNotificationsEnabled(value);

    updateNotificationSettings.mutate(
      { parentNotificationsEnabled: value },
      {
        onError: () => setParentNotificationsEnabled(previousValue),
      },
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      t("p-dashboard.settings.deleteAccountConfirmTitle"),
      t("p-dashboard.settings.deleteAccountConfirmMessage"),
      [
        {
          text: t("p-dashboard.settings.deleteAccountCancel"),
          style: "cancel",
        },
        {
          text: t("p-dashboard.settings.deleteAccountConfirm"),
          style: "destructive",
          onPress: () => deleteAccount.mutate(),
        },
      ],
    );
  };

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
              onValueChange={handleChildNotificationsChange}
            />
          }
        />

        <SettingsRow
          title={t("p-dashboard.settings.parentNotif")}
          icon={Icons.notification}
          rightContent={
            <CustomSwitch
              value={parentNotificationsEnabled}
              onValueChange={handleParentNotificationsChange}
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
          onPress={confirmDeleteAccount}
        />
      </ThemedView>
    </View>
  );
}
