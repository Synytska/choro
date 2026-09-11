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
import { ChildCard } from "@/lib/types";
import { getLanguageOption } from "@/lib/utils/utils";

import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useUpdateNotificationSettings } from "../hooks/useUpdateNotificationSettings";
import { styles } from "../styles";
import { SettingsRow } from "./SettingsRow";

type AppSettingsProps = {
  kids: ChildCard[];
};

export function AppSettings({ kids }: AppSettingsProps) {
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

  const selectedParentLanguage = getLanguageOption(profile?.language);
  const childLanguages = Array.from(new Set(kids.map((kid) => kid.language).filter(Boolean)));
  const selectedChildrenLanguage =
    childLanguages.length === 1 ? getLanguageOption(childLanguages[0]) : null;
  const childrenLanguageLabel = kids.length
    ? (selectedChildrenLanguage?.short ?? t("common.mixed"))
    : t("common.noInfo");

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
      t("parent.settings.deleteAccountConfirmTitle"),
      t("parent.settings.deleteAccountConfirmMessage"),
      [
        {
          text: t("parent.settings.deleteAccountCancel"),
          style: "cancel",
        },
        {
          text: t("parent.settings.deleteAccountConfirm"),
          style: "destructive",
          onPress: () => deleteAccount.mutate(),
        },
      ],
    );
  };

  const settings = [
    {
      title: t("parent.settings.childNotif"),
      icon: Icons.notification,
      showDivider: true,
      rightContent: (
        <CustomSwitch
          value={childNotificationsEnabled}
          onValueChange={handleChildNotificationsChange}
        />
      ),
    },
    {
      title: t("parent.settings.parentNotif"),
      icon: Icons.notification,
      showDivider: true,
      rightContent: (
        <CustomSwitch
          value={parentNotificationsEnabled}
          onValueChange={handleParentNotificationsChange}
        />
      ),
    },
    {
      title: t("parent.settings.parentLanguage"),
      icon: Icons.language,
      showDivider: true,
      rightContent: (
        <View style={styles.commonWrapper}>
          <ThemedText>{selectedParentLanguage.short}</ThemedText>
          <AppIcon icon={Icons.chevronRight} />
        </View>
      ),
      onPress: () =>
        router.push({
          pathname: "/language-modal",
          params: { target: "parent" },
        }),
    },
    {
      title: t("parent.settings.childrenLanguage"),
      icon: Icons.language,
      showDivider: true,
      rightContent: (
        <View style={styles.commonWrapper}>
          <ThemedText>{childrenLanguageLabel}</ThemedText>
          <AppIcon icon={Icons.chevronRight} />
        </View>
      ),
      onPress: kids.length
        ? () =>
            router.push({
              pathname: "/language-modal",
              params: { target: "children" },
            })
        : undefined,
    },
    {
      title: t("parent.settings.logout"),
      icon: Icons.logout,
      destructive: true,
      showDivider: true,
      onPress: () => logout(),
    },
    {
      title: t("parent.settings.deleteAccount"),
      icon: Icons.bin,
      destructive: true,
      showDivider: false,
      onPress: confirmDeleteAccount,
    },
  ];
  return (
    <View style={styles.contentWrapper}>
      <ThemedText style={styles.sectionHeader}>{t("parent.settings.appSettings")}</ThemedText>

      <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
        {settings.map((item, index) => (
          <SettingsRow
            key={`${index}${item.title}`}
            title={item.title}
            icon={item.icon}
            rightContent={item.rightContent}
            showDivider={item.showDivider}
            onPress={item.onPress}
            destructive={item.destructive}
          />
        ))}
      </ThemedView>
    </View>
  );
}
