import { useState } from "react";

import { defaultChildAvatarId } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";

type UsePickAvatarOptions = {
  initialAvatarId?: string | null;
  initialAvatarImageUri?: string | null;
  initialAvatarImageMimeType?: string | null;
};

export function usePickAvatar({
  initialAvatarId = defaultChildAvatarId,
  initialAvatarImageUri = null,
  initialAvatarImageMimeType = null,
}: UsePickAvatarOptions = {}) {
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId ?? defaultChildAvatarId);
  const [avatarImageUri, setAvatarImageUri] = useState<string | null>(initialAvatarImageUri);
  const [avatarImageMimeType, setAvatarImageMimeType] = useState<string | null>(
    initialAvatarImageMimeType,
  );

  const onSelectAvatar = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setAvatarImageUri(null);
    setAvatarImageMimeType(null);
  };

  const handlePickAvatarImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setAvatarImageUri(image.uri);
    setAvatarImageMimeType(image.mimeType ?? null);
  };

  return {
    selectedAvatarId,
    avatarImageMimeType,
    avatarImageUri,
    onSelectAvatar,
    handlePickAvatarImage,
  };
}
