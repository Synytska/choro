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

const taskStatusSortOrder: Record<TaskItem["status"], number> = {
  [taskStatus.review]: 0,
  [taskStatus.pending]: 1,
  [taskStatus.done]: 2,
};

const sortTasksForParentReview = (tasks: TaskItem[]) =>
  [...tasks].sort(
    (firstTask, secondTask) =>
      taskStatusSortOrder[firstTask.status] - taskStatusSortOrder[secondTask.status],
  );

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
    return sortTasksForParentReview(tasks);
  }

  return sortTasksForParentReview(tasks.filter((task) => task.status === selectedFilter));
};

export const getTaskFilterTitleKey = (
  selectedFilter: DashboardTaskFilter,
  titleKeys?: TaskFilterTitleKeys,
) => titleKeys?.[selectedFilter] ?? defaultTitleKeys[selectedFilter];
