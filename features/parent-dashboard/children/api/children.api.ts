import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";

import { taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { TaskSelection } from "@/lib/types";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

const generateChildCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
const CHILD_AVATARS_BUCKET = "child-avatars";

type FamilyRow = {
  id: string;
};

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

const getOrCreateFamily = async (parentId: string) => {
  const { data: existingFamily, error: existingFamilyError } = await supabase
    .from("families")
    .select("*")
    .eq("parent_id", parentId)
    .limit(1)
    .maybeSingle();

  if (existingFamilyError) throw existingFamilyError;
  if (existingFamily) return existingFamily as FamilyRow;

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({
      parent_id: parentId,
    })
    .select()
    .single();

  if (familyError) throw familyError;

  return family as FamilyRow;
};

const getFamilyIds = async (parentId: string) => {
  const { data, error } = await supabase.from("families").select("id").eq("parent_id", parentId);

  if (error) throw error;

  return ((data ?? []) as FamilyRow[]).map((family) => family.id);
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

const isRemoteUri = (uri: string) => uri.startsWith("http://") || uri.startsWith("https://");

const getFileExtension = (uri: string) => {
  const pathWithoutQuery = uri.split("?")[0];
  const extension = pathWithoutQuery.split(".").pop();

  return extension || "jpg";
};

const uploadChildAvatar = async (uri: string, userId: string, mimeType?: string | null) => {
  if (isRemoteUri(uri)) {
    return uri;
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  const fileExtension = getFileExtension(uri);
  const filePath = `${userId}/${Date.now()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from(CHILD_AVATARS_BUCKET)
    .upload(filePath, decode(base64), {
      contentType: mimeType || "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(CHILD_AVATARS_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
};

const replaceChildTasks = async (childId: string, tasks: TaskSelection[]) => {
  const { error: deleteTasksError } = await supabase
    .from("child_tasks")
    .delete()
    .eq("child_id", childId);

  if (deleteTasksError) throw deleteTasksError;

  const selectedTasks = tasks
    .filter((task) => task.selected)
    .map((task) => ({
      child_id: childId,
      title: task.title,
      emoji: task.emoji,
      coin_reward: task.coins,
      status: task.status ?? taskStatus.pending,
    }));

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
