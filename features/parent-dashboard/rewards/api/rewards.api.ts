import { getFamilyIds, getOwnedChildIds } from "@/features/parent-dashboard/api/family";
import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";
import { uploadImageToBucket } from "@/lib/supabase-storage";
import { getRewardImageUri } from "@/lib/utils/utils";

const REWARD_IMAGES_BUCKET = "reward-images";

export type CreateRewardPayload = {
  childIds: string[];
  name: string;
  coinAmount: number;
  icon?: string;
  imageUri?: string | null;
  imageMimeType?: string | null;
};

export type GetRewardDetails = {
  id: string;
  childId: string;
  name: string;
  coinAmount: number;
  icon: string | null;
  imageUri?: string | null;
};

export type UpdateRewardPayload = {
  rewardId: string;
  name: string;
  coinAmount: number;
  icon?: string;
  imageUri?: string | null;
  imageMimeType?: string | null;
};

export type DeleteRewardPayload = {
  rewardId: string;
};

type RewardRow = {
  id: string;
  child_id: string;
  name?: string | null;
  coin_amount?: number | string | null;
  icon?: string | null;
  image_uri?: string | null;
};

const getRewardById = async (rewardId: string) => {
  const { data, error } = await supabase
    .from("rewards")
    .select("id, child_id, name, coin_amount, icon, image_uri")
    .eq("id", rewardId)
    .maybeSingle();

  if (error) throw error;

  return data as RewardRow | null;
};

const getOwnedReward = async (rewardId: string, familyIds: string[]) => {
  const reward = await getRewardById(rewardId);

  if (!reward) {
    throw new Error("Reward not found");
  }

  const ownedChildIds = await getOwnedChildIds([reward.child_id], familyIds);

  if (!ownedChildIds.length) {
    throw new Error("Reward not found");
  }

  return reward;
};

const uploadRewardImage = (uri: string, userId: string, mimeType?: string | null) =>
  uploadImageToBucket({ bucket: REWARD_IMAGES_BUCKET, uri, userId, mimeType });

export const rewardsApi = {
  createReward: async (payload: CreateRewardPayload) => {
    const name = payload.name.trim();
    const coinAmount = Math.max(1, payload.coinAmount);

    if (!name) {
      throw new Error("Reward name is required");
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

    const imageUrl = payload.imageUri
      ? await uploadRewardImage(payload.imageUri, user.id, payload.imageMimeType)
      : null;
    const iconValue = imageUrl ?? payload.icon?.trim();

    if (!iconValue) {
      throw new Error("Select reward icon or image");
    }

    const rewardRows = ownedChildIds.map((childId) => ({
      child_id: childId,
      name,
      coin_amount: coinAmount,
      icon: iconValue,
      image_uri: imageUrl,
    }));

    const { data, error } = await supabase.from("rewards").insert(rewardRows).select();

    if (error) throw error;

    return data ?? [];
  },

  getRewardDetails: async (rewardId: string): Promise<GetRewardDetails | null> => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);
    if (!familyIds.length) return null;

    const reward = await getOwnedReward(rewardId, familyIds);
    const coinAmount = Number(reward.coin_amount ?? 0);

    return {
      id: reward.id,
      childId: reward.child_id,
      name: reward.name ?? "",
      coinAmount: Number.isFinite(coinAmount) ? coinAmount : 0,
      icon: reward.icon ?? null,
      imageUri: getRewardImageUri(reward.image_uri, reward.icon),
    };
  },

  updateReward: async (payload: UpdateRewardPayload) => {
    const name = payload.name.trim();
    const coinAmount = Math.max(1, payload.coinAmount);

    if (!name) {
      throw new Error("Reward name is required");
    }

    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Reward not found");
    }

    const reward = await getOwnedReward(payload.rewardId, familyIds);
    const imageUrl = payload.imageUri
      ? await uploadRewardImage(payload.imageUri, user.id, payload.imageMimeType)
      : null;
    const iconValue = imageUrl ?? payload.icon?.trim();

    if (!iconValue) {
      throw new Error("Select reward icon or image");
    }

    const { data, error } = await supabase
      .from("rewards")
      .update({
        name,
        coin_amount: coinAmount,
        icon: iconValue,
        image_uri: imageUrl,
      })
      .eq("id", reward.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  deleteReward: async (payload: DeleteRewardPayload) => {
    const user = await getRequiredCurrentUser();
    const familyIds = await getFamilyIds(user.id);

    if (!familyIds.length) {
      throw new Error("Reward not found");
    }

    const reward = await getOwnedReward(payload.rewardId, familyIds);

    const { error } = await supabase.from("rewards").delete().eq("id", payload.rewardId);

    if (error) throw error;

    return reward;
  },
};
