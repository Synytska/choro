/**
 * Shared bottom tab navigator for parent and kid role dashboards.
 *
 * Props:
 * - tabs: optional list of tab configs. Defaults to the parent dashboard tab structure.
 * Hidden routes like settings can be registered here with href: null.
 */
import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { useAppColors } from "@/hooks/use-app-colors";
import { AppIconConfig } from "@/lib/types";

import { AppIcon, Icons } from "../ui/AppIcon";

export type RoleTabItem = {
  name: string;
  title: string;
  icon: AppIconConfig;
};

//TODO: Localize strings
export const defaultRoleTabs: RoleTabItem[] = [
  {
    name: "index",
    title: "Home",
    icon: Icons.home,
  },
  {
    name: "children",
    title: "Children",
    icon: Icons.groups,
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: Icons.assignment,
  },
  {
    name: "rewards/index",
    title: "Rewards",
    icon: Icons.gift,
  },
  {
    name: "settings/index",
    title: "Settings",
    icon: Icons.user,
  },
];

type RoleTabsProps = {
  tabs?: RoleTabItem[];
};

export function RoleTabs({ tabs = defaultRoleTabs }: RoleTabsProps) {
  const colors = useAppColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.darkGrey,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopColor: colors.middleGrey,
          backgroundColor: colors.white,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => <AppIcon icon={tab.icon} size={22} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
