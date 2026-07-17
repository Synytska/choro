import { RoleTabs } from "@/components/navigation/RoleTabs";
import { Icons } from "@/components/ui/AppIcon";
import { role } from "@/lib/constants";
import { RoleTabItem } from "@/lib/types";

const parentRoleTabs: RoleTabItem[] = [
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

export default function ParentRoleLayout() {
  return <RoleTabs tabRole={role.parent} tabs={parentRoleTabs} />;
}
