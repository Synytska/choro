import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";

import { supabase } from "@/lib/supabase";

type UploadImageToBucketPayload = {
  bucket: string;
  uri: string;
  userId: string;
  mimeType?: string | null;
};

export const isRemoteUri = (uri: string) => uri.startsWith("http://") || uri.startsWith("https://");

const getFileExtension = (uri: string) => {
  const pathWithoutQuery = uri.split("?")[0];
  const extension = pathWithoutQuery.split(".").pop();

  return extension || "jpg";
};

export const uploadImageToBucket = async ({
  bucket,
  uri,
  userId,
  mimeType,
}: UploadImageToBucketPayload) => {
  if (isRemoteUri(uri)) {
    return uri;
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  const fileExtension = getFileExtension(uri);
  const filePath = `${userId}/${Date.now()}.${fileExtension}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, decode(base64), {
    contentType: mimeType || "image/jpeg",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
};
