import { t } from "i18next";
import { Dimensions } from "react-native";

export const fullScreenHeight = Math.round(Dimensions.get("window").height);
export const fullScreenWidth = Math.round(Dimensions.get("window").width);

export const totalOnboardingSteps = 6;

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

export const repeatDays = [
  { id: "Mon", label: t("common.days.full.monday"), value: t("common.days.short.monday") },
  { id: "Tue", label: t("common.days.full.tuesday"), value: t("common.days.short.tuesday") },
  { id: "Wed", label: t("common.days.full.wednesday"), value: t("common.days.short.wednesday") },
  { id: "Thu", label: t("common.days.full.thursday"), value: t("common.days.short.thursday") },
  { id: "Fri", label: t("common.days.full.friday"), value: t("common.days.short.friday") },
  { id: "Sat", label: t("common.days.full.saturday"), value: t("common.days.short.saturday") },
  { id: "Sun", label: t("common.days.full.sunday"), value: t("common.days.short.sunday") },
];
