import { getFamilyIds, getOrCreateFamily } from "@/features/parent-dashboard/api/family";
import { mapSelectedTaskRows } from "@/features/parent-dashboard/api/taskRows";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
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

const replaceChildTasks = async (childId: string, tasks: TaskSelection[]) => {
  const { error: deleteTasksError } = await supabase
    .from("child_tasks")
    .delete()
    .eq("child_id", childId);

  if (deleteTasksError) throw deleteTasksError;

  const selectedTasks = mapSelectedTaskRows(childId, tasks);

  if (selectedTasks.length > 0) {
    const { error: tasksError } = await supabase.from("child_tasks").insert(selectedTasks);

    if (tasksError) throw tasksError;
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
    const tasks = await replaceChildTasks(payload.id, payload.tasks);

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
