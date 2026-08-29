import { taskStatus } from "@/lib/constants";
import { OnboardingTask, TaskSelection } from "@/lib/types";
import { getTodayDateKey } from "@/lib/utils/utils";

type SelectableTask = OnboardingTask | TaskSelection;

export const mapSelectedTaskRows = (childId: string, tasks: SelectableTask[]) =>
  tasks
    .filter((task) => task.selected)
    .map((task) => {
      const isTaskSelection = "taskType" in task;

      const taskType = isTaskSelection ? task.taskType : "default";

      const repeatDays = isTaskSelection
        ? task.repeatDays
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      return {
        ...(isTaskSelection && task.taskDbId ? { id: task.taskDbId } : {}),

        child_id: childId,
        title: task.title,
        emoji: task.emoji,
        coin_reward: task.coins,
        category: task.category ?? null,
        default_task_key: task.defaultTaskKey ?? null,

        due_at: taskType === "one-time" ? getTodayDateKey() : null,

        repeat_days: repeatDays,

        status: "status" in task ? (task.status ?? taskStatus.pending) : taskStatus.pending,
      };
    });
