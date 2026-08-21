import { getFamilyIds, getOrCreateFamily } from "@/features/parent-dashboard/api/family";
import { mapSelectedTaskRows } from "@/features/parent-dashboard/api/taskRows";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { SupabaseChildTaskRow } from "@/lib/supabase-types";
import { TaskSelection } from "@/lib/types";
import { generateChildCode } from "@/lib/utils/utils";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

const CHILD_AVATARS_BUCKET = "child-avatars";

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

const normalizeTaskTitle = (title?: string | null) => title?.trim().toLowerCase() ?? "";

const getChildTaskTemplates = async (childId: string) => {
  const { data, error } = await supabase
    .from("child_tasks")
    .select("*")
    .eq("child_id", childId)
    .is("parent_task_id", null)
    .is("due_at", null);

  if (error) throw error;

  return (data ?? []) as ChildTaskTemplateRow[];
};

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

const syncChildTaskTemplates = async (childId: string, tasks: TaskSelection[]) => {
  const existingTemplates = await getChildTaskTemplates(childId);
  const selectedTasks = mapSelectedTaskRows(childId, tasks);
  const selectedTaskTitles = new Set(selectedTasks.map((task) => normalizeTaskTitle(task.title)));
  const existingTemplatesByTitle = new Map(
    existingTemplates.map((task) => [normalizeTaskTitle(task.title), task]),
  );

  await Promise.all(
    selectedTasks.map(async (task) => {
      const existingTemplate = existingTemplatesByTitle.get(normalizeTaskTitle(task.title));

      if (!existingTemplate) {
        const { error } = await supabase.from("child_tasks").insert(task);

        if (error) throw error;

        return;
      }

      const { child_id: _childId, ...taskUpdate } = task;
      const { error } = await supabase
        .from("child_tasks")
        .update(taskUpdate)
        .eq("id", existingTemplate.id);

      if (error) throw error;

      const { error: occurrenceError } = await supabase
        .from("child_tasks")
        .update({
          title: task.title,
          emoji: task.emoji,
          coin_reward: task.coin_reward,
          category: task.category,
          repeat_days: task.repeat_days,
        })
        .eq("child_id", childId)
        .eq("parent_task_id", existingTemplate.id)
        .neq("status", "done")
        .gte("due_at", `${getTodayDateKey()}T00:00:00.000Z`)
        .lt("due_at", `${getTodayDateKey()}T23:59:59.999Z`);

      if (occurrenceError) throw occurrenceError;
    }),
  );

  const templateIdsToDelete = existingTemplates
    .filter((template) => !selectedTaskTitles.has(normalizeTaskTitle(template.title)))
    .map((template) => template.id);

  if (templateIdsToDelete.length > 0) {
    const { error } = await supabase.from("child_tasks").delete().in("id", templateIdsToDelete);

    if (error) throw error;
  }

  return selectedTasks;
};

export const childrenApi = {
  addChild: async (payload: AddChildPayload) => {
    const user = await getRequiredCurrentUser();
    const family = await getOrCreateFamily(user.id);
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
