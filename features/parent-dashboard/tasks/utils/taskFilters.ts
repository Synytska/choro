import { dashboardTaskFilter, taskStatus } from "@/lib/constants";
import type { DashboardTaskFilter, TaskItem } from "@/lib/types";

export type TaskCounts = {
  total: number;
  pending: number;
  done: number;
  review: number;
};

export type TaskFilterTitleKeys = Partial<Record<DashboardTaskFilter, string>>;

const defaultTitleKeys: Record<DashboardTaskFilter, string> = {
  [dashboardTaskFilter.today]: "parent.home.activeTasks",
  [dashboardTaskFilter.done]: "parent.home.doneTasks",
  [dashboardTaskFilter.pending]: "parent.home.pendingTasks",
  [dashboardTaskFilter.review]: "parent.home.reviewTasks",
};

export const getTaskCounts = (tasks: TaskItem[]): TaskCounts => ({
  total: tasks.length,
  pending: tasks.filter((task) => task.status === taskStatus.pending).length,
  done: tasks.filter((task) => task.status === taskStatus.done).length,
  review: tasks.filter((task) => task.status === taskStatus.review).length,
});

export const filterTasksByDashboardFilter = (
  tasks: TaskItem[],
  selectedFilter: DashboardTaskFilter,
) => {
  if (selectedFilter === dashboardTaskFilter.today) {
    return tasks;
  }

  return tasks.filter((task) => task.status === selectedFilter);
};

export const getTaskFilterTitleKey = (
  selectedFilter: DashboardTaskFilter,
  titleKeys?: TaskFilterTitleKeys,
) => titleKeys?.[selectedFilter] ?? defaultTitleKeys[selectedFilter];
