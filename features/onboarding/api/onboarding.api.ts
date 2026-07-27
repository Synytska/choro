import { mapSelectedTaskRows } from "@/features/parent-dashboard/api/taskRows";
import { uploadChildAvatar } from "@/features/parent-dashboard/children/api/children.api";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { TaskCategory } from "@/lib/types";
import { generateChildCode } from "@/lib/utils/utils";

const REWARD_IMAGES_BUCKET = "reward-images";

export type SaveOnboardingPayload = {
  childName: string;
  childAge: number;
  childGender: "girl" | "boy";
  avatarId?: string | null;
  avatarImageUri?: string | null;
  avatarImageMimeType?: string | null;
  tasks: {
    id: string;
    title: string;
    emoji: string;
    selected: boolean;
    coins: number;
    category?: TaskCategory | null;
  }[];
  prize: {
    name: string;
    coinAmount: string;
    icon?: string | null;
    imageUri: string | null;
    imageMimeType?: string | null;
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
    const avatarUrl = payload.avatarImageUri
      ? await uploadChildAvatar(payload.avatarImageUri, user.id, payload.avatarImageMimeType)
      : null;

    const { data: child, error: childError } = await supabase
      .from("children")
      .insert({
        family_id: family.id,
        name: payload.childName,
        age: payload.childAge,
        gender: payload.childGender,
        login_code: childCode,
        avatar_id: avatarUrl ? null : payload.avatarId,
        avatar_url: avatarUrl,
      })
      .select()
      .single();

    if (childError) throw childError;

    const selectedTasks = mapSelectedTaskRows(child.id, payload.tasks);

    if (selectedTasks.length > 0) {
      const { error: tasksError } = await supabase.from("child_tasks").insert(selectedTasks);

      if (tasksError) throw tasksError;
    }

    const rewardImageUrl = payload.prize.imageUri
      ? await uploadImageToBucket({
          bucket: REWARD_IMAGES_BUCKET,
          uri: payload.prize.imageUri,
          userId: user.id,
          mimeType: payload.prize.imageMimeType,
        })
      : null;
    const rewardIcon = rewardImageUrl ?? payload.prize.icon?.trim() ?? null;

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .insert({
        child_id: child.id,
        name: payload.prize.name,
        coin_amount: Number(payload.prize.coinAmount),
        icon: rewardIcon,
        image_uri: rewardImageUrl,
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
