import { RoleTabItem, RoleTabs } from "@/components/navigation/RoleTabs";
import { Icons } from "@/components/ui/AppIcon";

const kidRoleTabs: RoleTabItem[] = [
  {
    name: "dashboard",
    title: "Home",
    icon: Icons.home,
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: Icons.assignment,
  },
  {
    name: "rewards",
    title: "Rewards",
    icon: Icons.gift,
  },
  {
    name: "settings",
    title: "Settings",
    icon: Icons.settings,
  },
];

export default function KidRoleLayout() {
  return <RoleTabs tabs={kidRoleTabs} />;
}
