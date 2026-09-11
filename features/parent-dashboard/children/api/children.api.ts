import { getFamilyIds, getOrCreateFamily } from "@/features/parent-dashboard/api/family";
import { taskStatus } from "@/lib/constants";
import { DefaultTaskKey, getDefaultTaskIdentity } from "@/lib/defaultTasks";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { SupabaseChildTaskRow } from "@/lib/supabase-types";
import { TaskSelection } from "@/lib/types";
import { generateChildCode, getTodayDateKey } from "@/lib/utils/utils";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

const CHILD_AVATARS_BUCKET = "child-avatars";
export const CHILD_NAME_EXISTS_ERROR = "CHILD_NAME_EXISTS";

export type AddChildPayload = {
  name: string;
  age: number;
  gender: ChildGender;
  avatarId?: string | null;
  avatarImageUri?: string | null;
  avatarImageMimeType?: string | null;
};

export type UpdateChildPayload = {
  id: string;
  name: string;
  age: number;
  gender: ChildGender;
  avatarId?: string | null;
  avatarImageUri?: string | null;
  avatarImageMimeType?: string | null;
};

export type UpdateTasksPayload = {
  id: string;
  tasks: TaskSelection[];
};

export type DeleteChildPayload = {
  childId: string;
};

const getOwnedChild = async (childId: string, familyIds: string[]) => {
  const { data: child, error } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .in("family_id", familyIds)
    .maybeSingle();

  if (error) throw error;
  if (!child) throw new Error("Child not found");

  return child;
};

export const uploadChildAvatar = (uri: string, userId: string, mimeType?: string | null) =>
  uploadImageToBucket({ bucket: CHILD_AVATARS_BUCKET, uri, userId, mimeType });

type ChildTaskTemplateRow = SupabaseChildTaskRow & {
  id: string;
};

const getTaskIdentity = (task: {
  defaultTaskKey?: DefaultTaskKey | null;
  default_task_key?: DefaultTaskKey | null;
  title?: string | null;
}) =>
  getDefaultTaskIdentity({
    defaultTaskKey: task.defaultTaskKey ?? task.default_task_key ?? null,
    title: task.title ?? "",
  });

const getChildParentTasks = async (childId: string) => {
  const { data, error } = await supabase
    .from("child_tasks")
    .select("*")
    .eq("child_id", childId)
    .is("parent_task_id", null);

  if (error) throw error;

  return (data ?? []) as ChildTaskTemplateRow[];
};

const getNextDateKey = (dateKey: string) => {
  const nextDate = new Date(`${dateKey}T00:00:00.000`);

  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate.toISOString().slice(0, 10);
};

const syncChildTaskTemplates = async (childId: string, tasks: TaskSelection[]) => {
  const existingTasks = await getChildParentTasks(childId);

  const existingTasksById = new Map(existingTasks.map((task) => [task.id, task]));

  const existingTasksByIdentity = new Map(
    existingTasks.map((task) => [getTaskIdentity(task), task]),
  );

  await Promise.all(
    tasks
      .filter((task) => task.selected)
      .map(async (task) => {
        const existingTask =
          (task.taskDbId ? existingTasksById.get(task.taskDbId) : undefined) ??
          existingTasksByIdentity.get(getTaskIdentity(task));

        // EXISTING TASK → UPDATE
        if (existingTask) {
          const updateData = {
            title: task.title,
            emoji: task.emoji,
            coin_reward: task.coins,
            category: task.category ?? null,
            default_task_key: task.defaultTaskKey ?? null,
            due_at: task.taskType === "one-time" ? getTodayDateKey() : null,
            repeat_days: task.repeatDays,
            status: task.status ?? taskStatus.pending,
          };

          const { error } = await supabase
            .from("child_tasks")
            .update(updateData)
            .eq("id", existingTask.id);

          if (error) throw error;

          // Update today's occurrence for recurring/default.
          if (task.taskType === "default" || task.taskType === "recurring") {
            const todayDateKey = getTodayDateKey();

            const { error: occurrenceError } = await supabase
              .from("child_tasks")
              .update({
                title: task.title,
                emoji: task.emoji,
                coin_reward: task.coins,
                category: task.category ?? null,
                repeat_days: task.repeatDays,
                default_task_key: task.defaultTaskKey ?? null,
              })
              .eq("child_id", childId)
              .eq("parent_task_id", existingTask.id)
              .neq("status", "done")
              .gte("due_at", `${todayDateKey}T00:00:00.000Z`)
              .lt("due_at", `${getNextDateKey(todayDateKey)}T00:00:00.000Z`);

            if (occurrenceError) throw occurrenceError;
          }

          return;
        }

        // NEW TASK → INSERT
        const insertData = {
          child_id: childId,
          title: task.title,
          emoji: task.emoji,
          coin_reward: task.coins,
          category: task.category ?? null,
          default_task_key: task.defaultTaskKey ?? null,
          due_at: task.taskType === "one-time" ? getTodayDateKey() : null,
          repeat_days: task.repeatDays,
          status: task.status ?? taskStatus.pending,
        };

        const { error } = await supabase.from("child_tasks").insert(insertData);

        if (error) throw error;
      }),
  );

  // Selected recurring/default templates.
  const selectedTemplateIdentities = new Set(
    tasks
      .filter(
        (task) => task.selected && (task.taskType === "default" || task.taskType === "recurring"),
      )
      .map(getTaskIdentity),
  );

  // Delete deselected templates.
  const templateIdsToDelete = existingTasks
    .filter(
      (task) => task.due_at === null && !selectedTemplateIdentities.has(getTaskIdentity(task)),
    )
    .map((task) => task.id);

  if (templateIdsToDelete.length > 0) {
    const { error } = await supabase.from("child_tasks").delete().in("id", templateIdsToDelete);

    if (error) throw error;
  }

  return tasks;
};

const checkChildNameExistsInFamilies = async (
  name: string,
  familyIds: string[],
  excludeChildId?: string,
) => {
  if (!familyIds.length) {
    return false;
  }

  const normalizedName = name.trim();

  if (!normalizedName) {
    return false;
  }

  let query = supabase
    .from("children")
    .select("id")
    .in("family_id", familyIds)
    .ilike("name", normalizedName);

  if (excludeChildId) {
    query = query.neq("id", excludeChildId);
  }

  const { data, error } = await query.limit(1);

  if (error) throw error;

  return (data?.length ?? 0) > 0;
};

export const checkChildNameExists = async (name: string, excludeChildId?: string) => {
  const user = await getRequiredCurrentUser();
  const familyIds = await getFamilyIds(user.id);

  return checkChildNameExistsInFamilies(name, familyIds, excludeChildId);
};

export const childrenApi = {
  addChild: async (payload: AddChildPayload) => {
    const user = await getRequiredCurrentUser();
    const family = await getOrCreateFamily(user.id);

    if (await checkChildNameExistsInFamilies(payload.name, [family.id])) {
      throw new Error(CHILD_NAME_EXISTS_ERROR);
    }

    const childCode = generateChildCode();
    const avatarUrl = payload.avatarImageUri
      ? await uploadChildAvatar(payload.avatarImageUri, user.id, payload.avatarImageMimeType)
      : null;

    const { data: child, error: childError } = await supabase
      .from("children")
      .insert({
        family_id: family.id,
        name: payload.name.trim(),
        age: payload.age,
        gender: payload.gender,
        avatar_id: avatarUrl ? null : payload.avatarId,
        avatar_url: avatarUrl,
        login_code: childCode,
      })
      .select()
      .single();

    if (childError) throw childError;

    return {
      family,
      child,
      childCode,
    };
  },

  updateChild: async (payload: UpdateChildPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Child not found");
    }

    if (await checkChildNameExistsInFamilies(payload.name, familyIds, payload.id)) {
      throw new Error(CHILD_NAME_EXISTS_ERROR);
    }

    const avatarUrl = payload.avatarImageUri
      ? await uploadChildAvatar(payload.avatarImageUri, user.id, payload.avatarImageMimeType)
      : null;

    const { data: child, error: childError } = await supabase
      .from("children")
      .update({
        name: payload.name.trim(),
        age: payload.age,
        gender: payload.gender,
        avatar_id: avatarUrl ? null : payload.avatarId,
        avatar_url: avatarUrl,
      })
      .eq("id", payload.id)
      .in("family_id", familyIds)
      .select()
      .maybeSingle();

    if (childError) throw childError;
    if (!child) throw new Error("Child not found");

    return {
      child,
    };
  },

  updateTasks: async (payload: UpdateTasksPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Child not found");
    }

    const child = await getOwnedChild(payload.id, familyIds);
    const tasks = await syncChildTaskTemplates(payload.id, payload.tasks);

    return {
      child,
      tasks,
    };
  },

  deleteChild: async (payload: DeleteChildPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Child not found");
    }

    await getOwnedChild(payload.childId, familyIds);

    const { error: tasksError } = await supabase
      .from("child_tasks")
      .delete()
      .eq("child_id", payload.childId);

    if (tasksError) throw tasksError;

    const { error: rewardsError } = await supabase
      .from("rewards")
      .delete()
      .eq("child_id", payload.childId);

    if (rewardsError) throw rewardsError;

    const { error: childError } = await supabase
      .from("children")
      .delete()
      .eq("id", payload.childId)
      .in("family_id", familyIds);

    if (childError) throw childError;

    return true;
  },
};
