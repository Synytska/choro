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

export const defaultRoleTabs: RoleTabItem[] = [
  {
    name: "index",
    title: "Home",
    icon: Icons.home,
  },
  {
    name: "children/index",
    title: "Children",
    icon: Icons.groups,
  },
  {
    name: "tasks/index",
    title: "Tasks",
    icon: Icons.assignment,
  },
  {
    name: "rewards/index",
    title: "Rewards",
    icon: Icons.gift,
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
        tabBarActiveTintColor: colors.darkNavy,
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
            tabBarIcon: ({ color, size }) => <AppIcon icon={tab.icon} size={size} color={color} />,
          }}
        />
      ))}
      <Tabs.Screen name="settings/index" options={{ href: null }} />
    </Tabs>
  );
}
