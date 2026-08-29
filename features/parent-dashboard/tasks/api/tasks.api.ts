import { notificationsApi } from "@/features/notifications/api/notifications.api";
import { getFamilyIds, getOwnedChildIds } from "@/features/parent-dashboard/api/family";
import { DefaultTaskKey, getDefaultTaskIdentity } from "@/lib/defaultTasks";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { SupabaseChildTaskRow } from "@/lib/supabase-types";
import { TaskCategory, TaskStatus } from "@/lib/types";
import { getTodayDateKey } from "@/lib/utils/utils";

export type CreateTaskPayload = {
  childIds: string[];
  title: string;
  description?: string;
  emoji: string;
  coinReward: number;
  category: TaskCategory;
  repeatDays: string[];
};

export type UpdateTaskStatusPayload = {
  taskId: string;
  status: TaskStatus;
  proofPhotoUri?: string | null;
  proofPhotoMimeType?: string | null;
  childId?: string | null;
  loginCode?: string | null;
};

export type DeleteTaskPayload = {
  childId: string;
  taskId?: string;
  title: string;
  isDefault: boolean;
  defaultTaskKey?: DefaultTaskKey | null;
};

type OwnedChildTaskRow = SupabaseChildTaskRow & {
  id: string;
};

const UPDATE_TASK_STATUS_RPC = "update_child_task_status";
const SUBMIT_CHILD_TASK_FOR_REVIEW_RPC = "submit_child_task_for_review";
const TASK_PROOFS_BUCKET = "task-proofs";

const uploadTaskProof = (uri: string, userId: string, mimeType?: string | null) =>
  uploadImageToBucket({ bucket: TASK_PROOFS_BUCKET, uri, userId, mimeType });

const getTaskIdentity = (task: {
  defaultTaskKey?: DefaultTaskKey | null;
  default_task_key?: DefaultTaskKey | null;
  title?: string | null;
}) =>
  getDefaultTaskIdentity({
    defaultTaskKey: task.defaultTaskKey ?? task.default_task_key ?? null,
    title: task.title ?? "",
  });

const getOwnedTask = async (taskId: string, familyIds: string[]) => {
  const { data: task, error: taskError } = await supabase
    .from("child_tasks")
    .select("id, child_id, parent_task_id, title, due_at")
    .eq("id", taskId)
    .maybeSingle();

  if (taskError) throw taskError;
  if (!task) throw new Error("Task not found");

  const ownedChildIds = await getOwnedChildIds([(task as OwnedChildTaskRow).child_id], familyIds);

  if (!ownedChildIds.length) {
    throw new Error("Task not found");
  }

  return task as OwnedChildTaskRow;
};

const deleteDefaultTaskForChild = async (payload: DeleteTaskPayload, familyIds: string[]) => {
  const ownedChildIds = await getOwnedChildIds([payload.childId], familyIds);

  if (!ownedChildIds.length) {
    throw new Error("Task not found");
  }

  const { data: templates, error: templatesError } = await supabase
    .from("child_tasks")
    .select("id, title")
    .eq("child_id", payload.childId)
    .is("parent_task_id", null)
    .is("due_at", null);

  if (templatesError) throw templatesError;

  const templateIds = ((templates ?? []) as OwnedChildTaskRow[])
    .filter((template) => getTaskIdentity(template) === getTaskIdentity(payload))
    .map((template) => template.id);

  if (!templateIds.length) {
    throw new Error("Task not found");
  }

  const { error } = await supabase.from("child_tasks").delete().in("id", templateIds);

  if (error) throw error;

  return templateIds;
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
      due_at: payload.repeatDays.length ? null : getTodayDateKey(),
      status: "pending",
      emoji: payload.emoji,
      category: payload.category,
      coin_reward: Math.max(1, payload.coinReward),
      xp_reward: Math.max(10, payload.coinReward * 10),
    }));

    const { data, error } = await supabase.from("child_tasks").insert(taskRows).select();

    if (error) throw error;

    return data ?? [];
  },

  updateTaskStatus: async (payload: UpdateTaskStatusPayload) => {
    if (payload.childId && payload.loginCode) {
      if (payload.status !== "review") {
        throw new Error("Kid can only submit tasks for review");
      }

      const proofPhotoUrl = payload.proofPhotoUri
        ? await uploadTaskProof(payload.proofPhotoUri, payload.childId, payload.proofPhotoMimeType)
        : null;

      const { data, error } = await supabase
        .rpc(SUBMIT_CHILD_TASK_FOR_REVIEW_RPC, {
          input_child_id: payload.childId,
          input_login_code: payload.loginCode,
          input_proof_photo_url: proofPhotoUrl,
          input_task_id: payload.taskId,
        })
        .single();

      if (error) throw error;

      notificationsApi
        .sendTaskReviewNotification({
          childId: payload.childId,
          loginCode: payload.loginCode,
          taskId: payload.taskId,
        })
        .catch((notificationError) => {
          logger.error("Task review notification error:", notificationError);
        });

      return data;
    }

    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Task not found");
    }

    await getOwnedTask(payload.taskId, familyIds);
    const proofPhotoUrl = payload.proofPhotoUri
      ? await uploadTaskProof(payload.proofPhotoUri, user.id, payload.proofPhotoMimeType)
      : null;
    const rpcPayload: {
      input_status: TaskStatus;
      input_task_id: string;
      input_proof_photo_url: string | null;
    } = {
      input_proof_photo_url: proofPhotoUrl,
      input_status: payload.status,
      input_task_id: payload.taskId,
    };

    const { data, error } = await supabase.rpc(UPDATE_TASK_STATUS_RPC, rpcPayload).single();

    if (error) throw error;

    if (payload.status === "done") {
      notificationsApi
        .sendChildTaskApprovedNotification({
          taskId: payload.taskId,
        })
        .catch((notificationError) => {
          logger.error("Child task approved notification error:", notificationError);
        });
    }

    return data;
  },

  deleteTask: async (payload: DeleteTaskPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Task not found");
    }

    if (payload.isDefault) {
      return deleteDefaultTaskForChild(payload, familyIds);
    }

    if (!payload.taskId) {
      throw new Error("Task not found");
    }

    const task = await getOwnedTask(payload.taskId, familyIds);
    const deleteTaskId = task.parent_task_id ?? task.id;

    const { error } = await supabase.from("child_tasks").delete().eq("id", deleteTaskId);

    if (error) throw error;

    return [deleteTaskId];
  },
};
