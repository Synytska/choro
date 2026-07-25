import { useMemo } from "react";

import { taskStatus } from "@/lib/constants";

import { useKidDashboard } from "./useKidDashboard";

export function useKidDashboardTasks() {
  const dashboardQuery = useKidDashboard();
  const tasks = dashboardQuery.data?.tasks ?? [];

  const taskGroups = useMemo(
    () => ({
      doneTasks: tasks.filter((task) => task.status === taskStatus.done),
      pendingTasks: tasks.filter((task) => task.status === taskStatus.pending),
      reviewTasks: tasks.filter((task) => task.status === taskStatus.review),
    }),
    [tasks],
  );

  return {
    ...dashboardQuery,
    child: dashboardQuery.data?.child,
    tasks,
    ...taskGroups,
  };
}
