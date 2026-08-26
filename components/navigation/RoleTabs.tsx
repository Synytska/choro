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
import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { defaultRoleTabs, role } from "@/lib/constants";
import { RoleBackground, RoleTabItem } from "@/lib/types";

import { AppIcon } from "../ui/AppIcon";
import { TabIcon } from "../ui/TabIcon";

type RoleTabsProps = {
  tabs?: RoleTabItem[];
  tabRole: RoleBackground;
  tabBadges?: Partial<Record<string, number>>;
};

export function RoleTabs({ tabs = defaultRoleTabs, tabBadges, tabRole }: RoleTabsProps) {
  const { t } = useTranslation();

  const parentBackground = useThemeColor(
    { light: Palette.white, dark: Palette.darkNavy },
    "background",
  );
  const parentBorder = useThemeColor(
    { light: Palette.middleGrey, dark: Palette.borderBlue },
    "background",
  );

  const parent = tabRole === role.parent;
  const tabBackground = parent ? parentBackground : Palette.darkNavy;
  const tabBorder = parent ? parentBorder : Palette.borderBlue;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.orange,
        tabBarInactiveTintColor: Palette.darkGrey,
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
      {tabs.map((tab) => {
        const badgeValue = tabBadges?.[tab.name];
        const tabBarBadge = badgeValue && badgeValue > 0 ? badgeValue : undefined;

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarBadge,
              popToTopOnBlur: true,
              title: t(`common.tabs.${tab.title.toLowerCase()}`, { defaultValue: tab.title }),
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
        );
      })}
    </Tabs>
  );
}
