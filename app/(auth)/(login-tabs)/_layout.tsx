import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="parent-login">
        <Label>{t("auth.parent.tab")}</Label>
        <Icon sf="person.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kid-login">
        <Icon sf="gamecontroller.fill" drawable="custom_settings_drawable" />
        <Label>{t("auth.kid.tab")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
