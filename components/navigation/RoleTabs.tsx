import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { ComponentProps } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useAppColors } from "@/hooks/use-app-colors";

export type RoleTabItem = {
  name: string;
  title: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
};

export const defaultRoleTabs: RoleTabItem[] = [
  {
    name: "dashboard",
    title: "Home",
    icon: "home",
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: "check-circle",
  },
  {
    name: "rewards",
    title: "Rewards",
    icon: "card-giftcard",
  },
  {
    name: "settings",
    title: "Settings",
    icon: "settings",
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
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
