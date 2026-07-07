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

type FamilyRow = {
  id: string;
};

type ChildRow = {
  id: string;
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
};
