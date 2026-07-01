import { supabase } from "@/lib/supabase";
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

export const childrenApi = {
  addChild: async (payload: AddChildPayload) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

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
};
