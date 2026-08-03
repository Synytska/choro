import { repeatDays, taskStatus } from "@/lib/constants";
import { TaskCategory } from "@/lib/types";

type SelectableTask = {
  selected: boolean;
  title: string;
  emoji: string;
  coins: number;
  category?: TaskCategory | null;
};

export const mapSelectedTaskRows = (childId: string, tasks: SelectableTask[]) =>
  tasks
    .filter((task) => task.selected)
    .map((task) => ({
      child_id: childId,
      title: task.title,
      emoji: task.emoji,
      coin_reward: task.coins,
      category: task.category ?? null,
      due_at: null,
      repeat_days: repeatDays.map((day) => day.id),
      status: taskStatus.pending,
    }));
