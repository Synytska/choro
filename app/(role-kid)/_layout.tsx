import { RoleTabs } from "@/components/navigation/RoleTabs";
import { Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { role } from "@/lib/constants";
import { RoleTabItem } from "@/lib/types";

const kidRoleTabs: RoleTabItem[] = [
  {
    name: "(home)",
    title: "Home",
    icon: Icons.home,
    activeColor: Palette.green,
  },
  {
    name: "(tasks)",
    title: "Tasks",
    icon: Icons.assignment,
    activeColor: Palette.skyBlue,
  },
  {
    name: "(rewards)",
    title: "Rewards",
    icon: Icons.gift,
    activeColor: Palette.logoDotRed,
  },
  {
    name: "(settings)",
    title: "Profile",
    icon: Icons.user,
    activeColor: Palette.yellow,
  },
];

export default function KidRoleLayout() {
  return <RoleTabs tabRole={role.kid} tabs={kidRoleTabs} />;
}
