import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { OnboardingTask } from "@/lib/types";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

const generateChildCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

type FamilyRow = {
  id: string;
};

export type AddChildPayload = {
  name: string;
  age: number;
  gender: ChildGender;
  tasks: OnboardingTask[];
  prize?: {
    name: string;
    coinAmount: string;
    imageUri: string | null;
  } | null;
};

export type UpdateChildPayload = {
  id: string;
  name: string;
  age: number;
  gender: ChildGender;
  tasks: OnboardingTask[];
};

export type UpdateTasksPayload = {
  id: string;
  tasks: OnboardingTask[];
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

const replaceChildTasks = async (childId: string, tasks: OnboardingTask[]) => {
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

    const { data: child, error: childError } = await supabase
      .from("children")
      .insert({
        family_id: family.id,
        name: payload.name.trim(),
        age: payload.age,
        gender: payload.gender,
        login_code: childCode,
      })
      .select()
      .single();

    if (childError) throw childError;

    const selectedTasks = payload.tasks
      .filter((task) => task.selected)
      .map((task) => ({
        child_id: child.id,
        title: task.title,
        emoji: task.emoji,
        coin_reward: task.coins,
      }));

    if (selectedTasks.length > 0) {
      const { error: tasksError } = await supabase.from("child_tasks").insert(selectedTasks);

      if (tasksError) throw tasksError;
    }

    if (!payload.prize) {
      return {
        family,
        child,
        reward: null,
        childCode,
      };
    }

    const prizeName = payload.prize.name.trim();
    const coinAmount = Number(payload.prize.coinAmount);

    if (!prizeName || !Number.isFinite(coinAmount)) {
      return {
        family,
        child,
        reward: null,
        childCode,
      };
    }

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .insert({
        child_id: child.id,
        name: prizeName,
        coin_amount: coinAmount,
        image_uri: payload.prize.imageUri,
      })
      .select()
      .single();

    if (rewardError) throw rewardError;

    return {
      family,
      child,
      reward,
      childCode,
    };
  },

  updateChild: async (payload: UpdateChildPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Child not found");
    }

    const { data: child, error: childError } = await supabase
      .from("children")
      .update({
        name: payload.name.trim(),
        age: payload.age,
        gender: payload.gender,
      })
      .eq("id", payload.id)
      .in("family_id", familyIds)
      .select()
      .maybeSingle();

    if (childError) throw childError;
    if (!child) throw new Error("Child not found");

    const tasks = await replaceChildTasks(payload.id, payload.tasks);

    return {
      child,
      tasks,
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
};
