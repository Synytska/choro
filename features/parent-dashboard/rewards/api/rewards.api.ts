import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";

import { supabase } from "@/lib/supabase";
import { getRequiredCurrentUser } from "@/lib/supabase-auth";

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

type FamilyRow = {
  id: string;
};

type ChildRow = {
  id: string;
};

type RewardRow = {
  id: string;
  child_id: string;
  name?: string | null;
  coin_amount?: number | string | null;
  icon?: string | null;
  image_uri?: string | null;
};

const getFamilyIds = async (parentId: string) => {
  const { data, error } = await supabase.from("families").select("id").eq("parent_id", parentId);

  if (error) throw error;

  return ((data ?? []) as FamilyRow[]).map((family) => family.id);
};

const getOwnedChildIds = async (childIds: string[], familyIds: string[]) => {
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .in("id", childIds)
    .in("family_id", familyIds);

  if (error) throw error;

  return ((data ?? []) as ChildRow[]).map((child) => child.id);
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

const isRemoteUri = (uri: string) => uri.startsWith("http://") || uri.startsWith("https://");

const getFileExtension = (uri: string) => {
  const pathWithoutQuery = uri.split("?")[0];
  const extension = pathWithoutQuery.split(".").pop();

  return extension || "jpg";
};

const uploadRewardImage = async (uri: string, userId: string, mimeType?: string | null) => {
  if (isRemoteUri(uri)) {
    return uri;
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  const fileExtension = getFileExtension(uri);
  const filePath = `${userId}/${Date.now()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from(REWARD_IMAGES_BUCKET)
    .upload(filePath, decode(base64), {
      contentType: mimeType || "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(REWARD_IMAGES_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
};

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
      imageUri: reward.image_uri ?? (reward.icon?.startsWith("http") ? reward.icon : null),
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
