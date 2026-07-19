import { RoleTabs } from "@/components/navigation/RoleTabs";
import { Icons } from "@/components/ui/AppIcon";
import { role } from "@/lib/constants";
import { RoleTabItem } from "@/lib/types";

const kidRoleTabs: RoleTabItem[] = [
  {
    name: "index",
    title: "Home",
    icon: Icons.home,
    activeColor: "green",
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: Icons.assignment,
    activeColor: "skyBlue",
  },
  {
    name: "rewards",
    title: "Rewards",
    icon: Icons.gift,
    activeColor: "logoDotRed",
  },
  {
    name: "settings",
    title: "Profile",
    icon: Icons.user,
    activeColor: "yellow",
  },
];

export default function KidRoleLayout() {
  return <RoleTabs tabRole={role.kid} tabs={kidRoleTabs} />;
}
