import { t } from "i18next";
import { Dimensions } from "react-native";

import { ChoroImages } from "@/assets/images";

import type { ChildAvatarOption, LanguageOption } from "./types";

export const fullScreenHeight = Math.round(Dimensions.get("window").height);
export const fullScreenWidth = Math.round(Dimensions.get("window").width);

export const totalOnboardingSteps = 6;
export const addButtonSize = 56;
export const tabBarHeight = 56;
export const scrollViewTop = 32;
export const modalTop = 42;

export const AUTH_ERROR = {
  PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",
  ACCOUNT_ALREADY_EXISTS: "ACCOUNT_ALREADY_EXISTS",
  INVALID_LOGIN_CREDENTIALS: "INVALID_LOGIN_CREDENTIALS",
  UNKNOWN_AUTH_ERROR: "UNKNOWN_AUTH_ERROR",
} as const;

export const taskEmojiOptions = [
  "🛏️",
  "🧸",
  "🪥",
  "🍽️",
  "🧽",
  "🗑️",
  "🧹",
  "🌻",
  "🐶",
  "📚",
  "🧺",
  "👕",
  "🧦",
  "🛁",
  "🚿",
  "🪴",
  "🥣",
  "🧼",
];

export const rewardEmojiOptions = [
  "🎁",
  "🍦",
  "🎂",
  "🍪",
  "🍕",
  "🍔",
  "🍟",
  "🍿",
  "🍩",
  "🍬",
  "🍭",
  "🍫",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🎾",
  "🏐",
  "🧸",
  "🪀",
  "🧩",
  "🎮",
  "🕹️",
  "📚",
  "🎨",
  "🎵",
  "🎸",
  "🚲",
  "🛹",
  "🛴",
  "🛼",
  "⭐",
  "🏅",
  "🏆",
  "👑",
  "✨",
  "❤️",
  "🌈",
  "🚀",
  "🪄",
  "🎉",
];

export const childAvatarOptions: ChildAvatarOption[] = [
  {
    id: "user",
    avatar: ChoroImages.user,
  },
  {
    id: "avatar-1",
    avatar: ChoroImages.girl_1,
  },
  {
    id: "avatar-2",
    avatar: ChoroImages.girl_2,
  },
  {
    id: "avatar-3",
    avatar: ChoroImages.girl_3,
  },
  {
    id: "avatar-4",
    avatar: ChoroImages.girl_4,
  },
  {
    id: "avatar-5",
    avatar: ChoroImages.girl_5,
  },
  {
    id: "avatar-6",
    avatar: ChoroImages.boy_1,
  },
  {
    id: "avatar-7",
    avatar: ChoroImages.boy_2,
  },
  {
    id: "avatar-8",
    avatar: ChoroImages.boy_3,
  },
  {
    id: "avatar-9",
    avatar: ChoroImages.boy_4,
  },
];

export const defaultChildAvatarId = childAvatarOptions[0].id;

export const repeatDays = [
  { id: "Mon", label: t("common.days.full.monday"), value: t("common.days.short.monday") },
  { id: "Tue", label: t("common.days.full.tuesday"), value: t("common.days.short.tuesday") },
  { id: "Wed", label: t("common.days.full.wednesday"), value: t("common.days.short.wednesday") },
  { id: "Thu", label: t("common.days.full.thursday"), value: t("common.days.short.thursday") },
  { id: "Fri", label: t("common.days.full.friday"), value: t("common.days.short.friday") },
  { id: "Sat", label: t("common.days.full.saturday"), value: t("common.days.short.saturday") },
  { id: "Sun", label: t("common.days.full.sunday"), value: t("common.days.short.sunday") },
];

export const supportedLanguages = ["en", "uk"] as const;

export const languageOptions: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇺🇸",
  },
  {
    code: "uk",
    label: "Ukrainian",
    nativeLabel: "Українська",
    flag: "🇺🇦",
  },
];

export const taskStatus = {
  pending: "pending",
  done: "done",
  review: "review",
} as const;

export const dashboardTaskFilter = {
  today: "today",
  ...taskStatus,
} as const;
