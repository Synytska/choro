import { ChoroImages } from "@/assets/images";

import { childAvatarOptions, languageOptions } from "../constants";
import { AppLanguage } from "../types";

/** Returns the first two characters of a name in uppercase for compact avatar labels. */
export const getInitials = (name: string) => {
  if (!name) return;

  return name.slice(0, 2).toUpperCase();
};

/** Normalizes any stored or device language value to a supported app language. */
export const normalizeLanguage = (language?: string | null): AppLanguage =>
  language === "uk" ? "uk" : "en";

/** Finds the configured language option for a language value, falling back to the default option. */
export const getLanguageOption = (language?: string | null) =>
  languageOptions.find((option) => option.code === normalizeLanguage(language)) ??
  languageOptions[0];

/** Resolves a child avatar source from an uploaded URL, bundled avatar id, or default user image. */
export const getChildAvatarImage = (
  avatarId?: string | null,
  avatarUrl?: string | null,
  childRole?: boolean,
) =>
  avatarUrl ??
  childAvatarOptions.find((option) => option.id === avatarId)?.avatar ??
  (childRole ? ChoroImages.kidAvatar : ChoroImages.user);

/** Generates a short uppercase login code for pairing a child account. */
export const generateChildCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

/** Returns the reward image URL, including legacy rewards that stored a remote image in icon. */
export const getRewardImageUri = (imageUri?: string | null, icon?: string | null) =>
  imageUri ?? (icon?.startsWith("http") ? icon : null);

/** Returns Date in format 'June 25, 2026' */
export const getDate = (today: Date) => {
  return today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getTodayDateKey = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
