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

export const role = {
  parent: "parent",
  kid: "kid",
  auth: "auth",
} as const;

export const buttonVariant = {
  primary: "primary",
  secondary: "secondary",
  thirdly: "thirdly",
  outline: "outline",
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
    title: "STREAK MASTER",
    icon: "🔥",
    description: "Complete at least one approved task every day for 7 days in a row",
    metric: "streakDays",
    target: 7,
  },
  {
    id: "streakpro",
    title: "STREAK MASTER PRO",
    icon: "💥",
    description: "Complete at least one approved task every day for 14 days in a row",
    metric: "streakDays",
    target: 14,
  },
  {
    id: "streakepic",
    title: "STREAK MASTER EPIC",
    icon: "💎",
    description: "Complete at least one approved task every day for 30 days in a row",
    metric: "streakDays",
    target: 30,
  },
  {
    id: "collector",
    title: "XP COLLECTOR",
    icon: "⭐",
    description: "Earn 100 XP by completing approved tasks",
    metric: "xpTotal",
    target: 100,
  },
  {
    id: "collectorpro",
    title: "XP COLLECTOR PRO",
    icon: "🌟",
    description: "Earn 500 XP by completing approved tasks",
    metric: "xpTotal",
    target: 500,
  },
  {
    id: "collectorepic",
    title: "XP COLLECTOR EPIC",
    icon: "💫",
    description: "Earn 1000 XP by completing approved tasks",
    metric: "xpTotal",
    target: 1000,
  },
  {
    id: "cleaning",
    title: "CLEANING HERO",
    icon: "🧹",
    description: "Complete 25 cleaning tasks and keep your home tidy",
    metric: "categoryCompletedTasks",
    target: 25,
    category: "cleaning",
  },
  {
    id: "explorer",
    title: "TASK EXPLORER",
    icon: "🚀",
    description: "Complete 10 different task types and discover new ways to help",
    metric: "uniqueCompletedTasks",
    target: 10,
  },
  {
    id: "legend",
    title: "HOME LEGEND",
    icon: "🏆",
    description: "Complete 100 approved tasks and become a family hero",
    metric: "completedTasks",
    target: 100,
  },
  {
    id: "helping",
    title: "HELPING HAND",
    icon: "🌱",
    description: "Complete 10 helping tasks for your family",
    metric: "categoryCompletedTasks",
    target: 10,
    category: "helping",
  },
  {
    id: "levelup",
    title: "LEVEL UP MASTER",
    icon: "🥇",
    description: "Reach level 5 by collecting XP and completing tasks",
    metric: "level",
    target: 5,
  },
  {
    id: "perfectweek",
    title: "PERFECT WEEK",
    icon: "🎯",
    description: "Complete all planned chores for 7 days in a row",
    metric: "perfectWeek",
    target: 7,
  },
  {
    id: "pethero",
    title: "PET CARE HERO",
    icon: "🐾",
    description: "Take care of your pet 20 times and earn this badge",
    metric: "categoryCompletedTasks",
    target: 20,
    category: "pet",
  },
  {
    id: "chef",
    title: "LITTLE CHEF",
    icon: "🍳",
    description: "Help prepare 10 meals and become a little chef",
    metric: "categoryCompletedTasks",
    target: 10,
    category: "cooking",
  },
  {
    id: "organization",
    title: "ORGANIZATION PRO",
    icon: "📚",
    description: "Keep your personal space clean for 14 days",
    metric: "categoryCompletedTasks",
    target: 14,
    category: "organization",
  },
];
