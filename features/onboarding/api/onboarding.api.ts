import { taskStatus } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";

const generateChildCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export type SaveOnboardingPayload = {
  childName: string;
  childAge: number;
  childGender: "girl" | "boy";
  tasks: {
    id: string;
    title: string;
    emoji: string;
    selected: boolean;
    coins: number;
  }[];
  prize: {
    name: string;
    coinAmount: string;
    imageUri: string | null;
  };
};

export const onboardingApi = {
  saveOnboarding: async (payload: SaveOnboardingPayload) => {
    const user = await getRequiredCurrentUser();
    const { data: family, error: familyError } = await supabase
      .from("families")
      .insert({
        parent_id: user.id,
      })
      .select()
      .single();

    if (familyError) throw familyError;

    const childCode = generateChildCode();

    const { data: child, error: childError } = await supabase
      .from("children")
      .insert({
        family_id: family.id,
        name: payload.childName,
        age: payload.childAge,
        gender: payload.childGender,
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
        status: taskStatus.pending,
      }));

    if (selectedTasks.length > 0) {
      const { error: tasksError } = await supabase.from("child_tasks").insert(selectedTasks);

      if (tasksError) throw tasksError;
    }

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .insert({
        child_id: child.id,
        name: payload.prize.name,
        coin_amount: Number(payload.prize.coinAmount),
        image_uri: payload.prize.imageUri,
      })
      .select()
      .single();

    if (rewardError) throw rewardError;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    return {
      family,
      child,
      reward,
      childCode,
    };
  },
};
