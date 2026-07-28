import { RoleTabs } from "@/components/navigation/RoleTabs";
import { Icons } from "@/components/ui/AppIcon";
import { useChildren } from "@/features/parent-dashboard/children/hooks/useChildren";
import { rewardStatus, role, taskStatus } from "@/lib/constants";
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
  const { data: dashboardData } = useChildren();
  const tasksToApprove = dashboardData?.tasks.filter((task) => task.status === taskStatus.review);
  const requestedRewards = dashboardData?.rewards.filter(
    (reward) => reward.status === rewardStatus.requested,
  );
  const badgeCount = (tasksToApprove?.length ?? 0) + (requestedRewards?.length ?? 0);

  return (
    <RoleTabs tabRole={role.parent} tabs={parentRoleTabs} tabBadges={{ children: badgeCount }} />
  );
}
