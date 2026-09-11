import { Dimensions } from "react-native";

import { ChoroImages } from "@/assets/images";
import { Icons } from "@/components/ui/AppIcon";

import type { AchievementItem, ChildAvatarOption, LanguageOption, RoleTabItem } from "./types";

export const fullScreenHeight = Math.round(Dimensions.get("window").height);
export const fullScreenWidth = Math.round(Dimensions.get("window").width);

export const totalOnboardingSteps = 6;
export const addButtonSize = 56;
export const tabBarHeight = 60;
export const scrollViewTop = 32;
export const scrollViewTopKid = 16;
export const modalTop = 42;
export const paddingHorizontal = 20;
export const levelUpCoins = 5;
export const achivExperience = 10;
export const authTabBarWidth = 200;
export const authTabBarHeight = 68;
export const androidBottomPadding = 50;
export const supportEmail = "choro.support@gmail.com";
export const privacyPolicyUrl = "https://choroprivacy.netlify.app/privacy";
export const termsOfUseUrl = "https://choroprivacy.netlify.app/terms";
export const appStoreId = "";
export const androidPackageName = "com.kisto4ka.choro";

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
  "🐈",
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

export const taskCategories = {
  cleaning: "cleaning",
  helping: "helping",
  pet: "pet",
  cooking: "cooking",
  organization: "organization",
} as const;

export const taskCategoryOptions = [
  {
    id: taskCategories.cleaning,
    labelKey: "common.taskCategories.cleaning",
    valueKey: "common.taskCategories.cleaning",
    icon: "🧹",
  },
  {
    id: taskCategories.helping,
    labelKey: "common.taskCategories.helping",
    valueKey: "common.taskCategories.helping",
    icon: "🌱",
  },
  {
    id: taskCategories.pet,
    labelKey: "common.taskCategories.pet",
    valueKey: "common.taskCategories.pet",
    icon: "🐾",
  },
  {
    id: taskCategories.cooking,
    labelKey: "common.taskCategories.cooking",
    valueKey: "common.taskCategories.cooking",
    icon: "🍳",
  },
  {
    id: taskCategories.organization,
    labelKey: "common.taskCategories.organization",
    valueKey: "common.taskCategories.organization",
    icon: "📚",
  },
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
    avatar: ChoroImages.boy_1,
  },
  {
    id: "avatar-3",
    avatar: ChoroImages.girl_3,
  },
  {
    id: "avatar-4",
    avatar: ChoroImages.boy_2,
  },
  {
    id: "avatar-5",
    avatar: ChoroImages.girl_2,
  },
  {
    id: "avatar-6",
    avatar: ChoroImages.boy_3,
  },
  {
    id: "avatar-7",
    avatar: ChoroImages.girl_4,
  },
  {
    id: "avatar-8",
    avatar: ChoroImages.boy_4,
  },
  {
    id: "avatar-9",
    avatar: ChoroImages.girl_5,
  },
];

export const defaultChildAvatarId = childAvatarOptions[0].id;

export const repeatDays = [
  { id: "Mon", labelKey: "common.days.full.monday", valueKey: "common.days.short.monday" },
  { id: "Tue", labelKey: "common.days.full.tuesday", valueKey: "common.days.short.tuesday" },
  { id: "Wed", labelKey: "common.days.full.wednesday", valueKey: "common.days.short.wednesday" },
  { id: "Thu", labelKey: "common.days.full.thursday", valueKey: "common.days.short.thursday" },
  { id: "Fri", labelKey: "common.days.full.friday", valueKey: "common.days.short.friday" },
  { id: "Sat", labelKey: "common.days.full.saturday", valueKey: "common.days.short.saturday" },
  { id: "Sun", labelKey: "common.days.full.sunday", valueKey: "common.days.short.sunday" },
];

export const supportedLanguages = ["en", "uk"] as const;

export const languageOptions: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇺🇸",
    short: "EN",
  },
  {
    code: "uk",
    label: "Ukrainian",
    nativeLabel: "Українська",
    flag: "🇺🇦",
    short: "Укр",
  },
];

export const taskStatus = {
  pending: "pending",
  done: "done",
  review: "review",
} as const;

export const rewardStatus = {
  available: "available",
  requested: "requested",
  given: "given",
} as const;

export const dashboardTaskFilter = {
  today: "today",
  ...taskStatus,
} as const;

export const role = {
  parent: "parent",
  kid: "kid",
  auth: "auth",
  kidLogin: "kidLogin",
} as const;

export const buttonVariant = {
  primary: "primary",
  secondary: "secondary",
  thirdly: "thirdly",
  outline: "outline",
} as const;

export const textType = {
  default: "default",
  title: "title",
  titleChild: "titleChild",
  subtitleChild: "subtitleChild",
  subtitle: "subtitle",
  link: "link",
} as const;

export const defaultRoleTabs: RoleTabItem[] = [
  {
    name: "index",
    title: "Home",
    icon: Icons.home,
  },
  {
    name: "children",
    title: "Children",
    icon: Icons.groups,
  },
  {
    name: "tasks",
    title: "Tasks",
    icon: Icons.assignment,
  },
  {
    name: "rewards",
    title: "Rewards",
    icon: Icons.gift,
  },
  {
    name: "settings",
    title: "Settings",
    icon: Icons.user,
  },
];

export const achievements: AchievementItem[] = [
  {
    id: "streak",
    icon: "🔥",
    metric: "streakDays",
    target: 7,
  },
  {
    id: "streakpro",
    icon: "💥",
    metric: "streakDays",
    target: 14,
  },
  {
    id: "streakepic",
    icon: "💎",
    metric: "streakDays",
    target: 30,
  },
  {
    id: "collector",
    icon: "⭐",
    metric: "xpTotal",
    target: 100,
  },
  {
    id: "collectorpro",
    icon: "🌟",
    metric: "xpTotal",
    target: 500,
  },
  {
    id: "collectorepic",
    icon: "💫",
    metric: "xpTotal",
    target: 1000,
  },
  {
    id: "cleaning",
    icon: "🧹",
    metric: "categoryCompletedTasks",
    target: 25,
    category: "cleaning",
  },
  {
    id: "explorer",
    icon: "🚀",
    metric: "uniqueCompletedTasks",
    target: 10,
  },
  {
    id: "legend",
    icon: "🏆",
    metric: "completedTasks",
    target: 100,
  },
  {
    id: "helping",
    icon: "🌱",
    metric: "categoryCompletedTasks",
    target: 10,
    category: "helping",
  },
  {
    id: "levelup",
    icon: "🥇",
    metric: "level",
    target: 5,
  },
  {
    id: "perfectweek",
    icon: "🎯",
    metric: "perfectWeek",
    target: 7,
  },
  {
    id: "pethero",
    icon: "🐾",
    metric: "categoryCompletedTasks",
    target: 20,
    category: "pet",
  },
  {
    id: "chef",
    icon: "🍳",
    metric: "categoryCompletedTasks",
    target: 10,
    category: "cooking",
  },
  {
    id: "organization",
    icon: "📚",
    metric: "categoryCompletedTasks",
    target: 14,
    category: "organization",
  },
];
