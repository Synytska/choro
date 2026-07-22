import { taskStatus } from "@/lib/constants";
import type { TaskItem } from "@/lib/types";

const taskStatusOrder = {
  [taskStatus.pending]: 0,
  [taskStatus.review]: 1,
  [taskStatus.done]: 2,
};

//Sort task: pending => review => done
export const sortKidTasksByStatus = (tasks: TaskItem[]) =>
  tasks
    .map((task, index) => ({ task, index }))
    .sort(
      (firstTask, secondTask) =>
        taskStatusOrder[firstTask.task.status] - taskStatusOrder[secondTask.task.status] ||
        firstTask.index - secondTask.index,
    )
    .map(({ task }) => task);

export const chunkTasks = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};
