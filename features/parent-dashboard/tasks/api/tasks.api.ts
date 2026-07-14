import { getFamilyIds, getOwnedChildIds } from "@/features/parent-dashboard/api/family";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { TaskStatus } from "@/lib/types";

export type CreateTaskPayload = {
  childIds: string[];
  title: string;
  description?: string;
  emoji: string;
  coinReward: number;
  repeatDays: string[];
};

export type UpdateTaskStatusPayload = {
  taskId: string;
  status: TaskStatus;
};

type ChildTaskRow = {
  id: string;
  child_id: string;
};

const getOwnedTask = async (taskId: string, familyIds: string[]) => {
  const { data: task, error: taskError } = await supabase
    .from("child_tasks")
    .select("id, child_id")
    .eq("id", taskId)
    .maybeSingle();

  if (taskError) throw taskError;
  if (!task) throw new Error("Task not found");

  const ownedChildIds = await getOwnedChildIds([(task as ChildTaskRow).child_id], familyIds);

  if (!ownedChildIds.length) {
    throw new Error("Task not found");
  }

  return task as ChildTaskRow;
};

export const tasksApi = {
  createTask: async (payload: CreateTaskPayload) => {
    const title = payload.title.trim();

    if (!title) {
      throw new Error("Task title is required");
    }

    if (!payload.childIds.length) {
      throw new Error("Select at least one child");
    }

    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Child not found");
    }

    const ownedChildIds = await getOwnedChildIds(payload.childIds, familyIds);

    if (ownedChildIds.length !== payload.childIds.length) {
      throw new Error("Child not found");
    }

    const taskRows = ownedChildIds.map((childId) => ({
      child_id: childId,
      title,
      description: payload.description?.trim() || null,
      repeat_days: payload.repeatDays,
      status: "pending",
      emoji: payload.emoji,
      coin_reward: Math.max(1, payload.coinReward),
    }));

    const { data, error } = await supabase.from("child_tasks").insert(taskRows).select();

    if (error) throw error;

    return data ?? [];
  },

  updateTaskStatus: async (payload: UpdateTaskStatusPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Task not found");
    }

    await getOwnedTask(payload.taskId, familyIds);

    const { data, error } = await supabase
      .from("child_tasks")
      .update({
        status: payload.status,
      })
      .eq("id", payload.taskId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};
