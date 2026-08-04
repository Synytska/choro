import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

import { AuthTabs } from "@/components/navigation/AuthTabs";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <AuthTabs {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: t("auth.parent.tab"),
        }}
      />

      <Tabs.Screen
        name="kid-login"
        options={{
          title: t("auth.kid.tab"),
        }}
      />
    </Tabs>
  );
}
