import React from "react";

import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="parent-login">
        <Label>{t("parent")}</Label>
        <Icon sf="person.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kid-login">
        <Icon sf="gamecontroller.fill" drawable="custom_settings_drawable" />
        <Label>{t("kid")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
