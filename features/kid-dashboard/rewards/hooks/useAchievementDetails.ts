import { useMemo } from "react";

import { achievements } from "@/lib/constants";
import { selectAuthUserLoginCode } from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { useKidDashboardTasks } from "../../home/hooks/useKidDashboardTasks";
import { calculateAchievements } from "../utils/achievementProgress";

export function useAchievementDetails(achievementId?: string) {
  const loginCode = useAppSelector(selectAuthUserLoginCode);
  const { child, data: dashboardData, isLoading, tasks } = useKidDashboardTasks();
  const rewards = dashboardData?.rewards;

  const achievementItems = useMemo(
    () =>
      calculateAchievements(achievements, {
        child,
        tasks,
        rewards,
        achievementStats: dashboardData?.achievementStats,
        childAchievements: dashboardData?.childAchievements,
      }),
    [child, dashboardData?.achievementStats, dashboardData?.childAchievements, rewards, tasks],
  );

  const achievement = useMemo(
    () => achievementItems.find((item) => item.id === achievementId),
    [achievementId, achievementItems],
  );

  return {
    achievement,
    childId: child?.id,
    isLoading,
    loginCode: loginCode ?? undefined,
  };
}
