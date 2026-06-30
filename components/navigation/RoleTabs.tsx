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
    name: "index",
    title: "Home",
    icon: "home",
  },
  {
    name: "children/index",
    title: "Children",
    icon: "groups",
  },
  {
    name: "tasks/index",
    title: "Tasks",
    icon: "assignment",
  },
  {
    name: "rewards/index",
    title: "Rewards",
    icon: "card-giftcard",
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
      <Tabs.Screen name="settings/index" options={{ href: null }} />
    </Tabs>
  );
}
