import { describe, expect, it } from "@jest/globals";

import { dashboardTaskFilter, taskStatus } from "@/lib/constants";
import type { TaskItem } from "@/lib/types";

import { filterTasksByDashboardFilter, getTaskCounts } from "../taskFilters";

const tasks: TaskItem[] = [
  {
    id: "pending-1",
    title: "Pending task",
    time: "09:00",
    status: taskStatus.pending,
  },
  {
    id: "done-1",
    title: "Done task",
    time: "10:00",
    status: taskStatus.done,
  },
  {
    id: "review-1",
    title: "Review task",
    time: "11:00",
    status: taskStatus.review,
  },
];

describe("taskFilters", () => {
  it("counts tasks by status", () => {
    expect(getTaskCounts(tasks)).toEqual({
      total: 3,
      pending: 1,
      done: 1,
      review: 1,
    });
  });

  it("shows review tasks first in the today filter", () => {
    const result = filterTasksByDashboardFilter(tasks, dashboardTaskFilter.today);

    expect(result.map((task) => task.id)).toEqual(["review-1", "pending-1", "done-1"]);
  });

  it("filters a specific status", () => {
    const result = filterTasksByDashboardFilter(tasks, dashboardTaskFilter.review);

    expect(result).toEqual([tasks[2]]);
  });
});
