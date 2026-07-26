/**
 * Shared bottom tab navigator for parent and kid role dashboards.
 *
 * Props:
 * - tabs: optional list of tab configs. Defaults to the parent dashboard tab structure.
 * Hidden routes like settings can be registered here with href: null.
 */
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { HapticTab } from "@/components/haptic-tab";
import { useAppColors } from "@/hooks/use-app-colors";
import { defaultRoleTabs, role } from "@/lib/constants";
import { RoleBackground, RoleTabItem } from "@/lib/types";

import { AppIcon } from "../ui/AppIcon";
import { TabIcon } from "../ui/TabIcon";

type RoleTabsProps = {
  tabs?: RoleTabItem[];
  tabRole: RoleBackground;
};

export function RoleTabs({ tabs = defaultRoleTabs, tabRole }: RoleTabsProps) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const parent = tabRole === role.parent;
  const tabBackground = parent ? colors.white : colors.darkNavy;
  const tabBorder = parent ? colors.middleGrey : colors.borderBlue;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.darkGrey,
        tabBarButton: HapticTab,
        tabBarStyle: [
          {
            borderTopColor: tabBorder,
            backgroundColor: tabBackground,
          },
          !parent && { paddingTop: 16, borderTopWidth: 2 },
        ],
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            popToTopOnBlur: true,
            title: t(`common.tabs.${tab.name}`, { defaultValue: tab.title }),
            tabBarShowLabel: parent ? true : false,
            tabBarIcon: ({ focused, color }) =>
              parent ? (
                <AppIcon icon={tab.icon} size={22} color={color} />
              ) : (
                <TabIcon
                  focused={focused}
                  icon={tab.icon}
                  activeColor={tab.activeColor ?? "green"}
                />
              ),
          }}
        />
      ))}
    </Tabs>
  );
}
