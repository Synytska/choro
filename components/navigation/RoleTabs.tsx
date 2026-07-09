/**
 * Shared bottom tab navigator for parent and kid role dashboards.
 *
 * Props:
 * - tabs: optional list of tab configs. Defaults to the parent dashboard tab structure.
 * Hidden routes like settings can be registered here with href: null.
 */

import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SFSymbol } from "expo-symbols";

export type RoleTabItem = {
  name: string;
  title: string;
  icon: SFSymbol;
};

//TODO: Localize strings
//TODO: Add drawable to every field
export const defaultRoleTabs: RoleTabItem[] = [
  {
    name: "index",
    title: "Home",
    icon: "house.fill",
  },
  {
    name: "children",
    title: "Children",
    icon: "person.2.fill",
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: "checklist",
  },
  {
    name: "rewards/index",
    title: "Rewards",
    icon: "gift.fill",
  },
  {
    name: "settings/index",
    title: "Settings",
    icon: "person.and.background.dotted",
  },
];

type RoleTabsProps = {
  tabs?: RoleTabItem[];
};

export function RoleTabs({ tabs = defaultRoleTabs }: RoleTabsProps) {
  return (
    <NativeTabs>
      {tabs.map((tab) => (
        <NativeTabs.Trigger name={tab.name} key={tab.name}>
          <Label>{tab.title}</Label>
          <Icon sf={tab.icon} drawable="custom_android_drawable" />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
