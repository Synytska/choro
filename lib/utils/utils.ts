import { ChoroImages } from "@/assets/images";

import { childAvatarOptions, languageOptions } from "../constants";
import { AppLanguage } from "../types";

//Get only first two letters of name
export const getInitials = (name: string) => {
  if (!name) return;

  return name.slice(0, 2).toUpperCase();
};

export const normalizeLanguage = (language?: string | null): AppLanguage =>
  language === "uk" ? "uk" : "en";

export const getLanguageOption = (language?: string | null) =>
  languageOptions.find((option) => option.code === normalizeLanguage(language)) ??
  languageOptions[0];

export const getChildAvatarImage = (avatarId?: string | null, avatarUrl?: string | null) =>
  avatarUrl ??
  childAvatarOptions.find((option) => option.id === avatarId)?.avatar ??
  ChoroImages.user;
