import { useMemo, useState } from "react";

import { dashboardTaskFilter } from "@/lib/constants";
import type { DashboardTaskFilter, TaskItem } from "@/lib/types";

import type { TaskFilterTitleKeys } from "../utils/taskFilters";
import {
  filterTasksByDashboardFilter,
  getTaskCounts,
  getTaskFilterTitleKey,
} from "../utils/taskFilters";

export function useDashboardTaskFilter(tasks: TaskItem[], titleKeys?: TaskFilterTitleKeys) {
  const [selectedFilter, setSelectedFilter] = useState<DashboardTaskFilter>(
    dashboardTaskFilter.today,
  );

  const counts = useMemo(() => getTaskCounts(tasks), [tasks]);

  const visibleTasks = useMemo(
    () => filterTasksByDashboardFilter(tasks, selectedFilter),
    [tasks, selectedFilter],
  );

  const titleKey = useMemo(
    () => getTaskFilterTitleKey(selectedFilter, titleKeys),
    [selectedFilter, titleKeys],
  );

  return {
    counts,
    selectedFilter,
    setSelectedFilter,
    titleKey,
    visibleTasks,
  };
}
