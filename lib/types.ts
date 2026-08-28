import { ImageSource } from "expo-image";
import { ReactNode } from "react";

import { Icons } from "@/components/ui/AppIcon";
import { DefaultTaskKey } from "@/lib/defaultTasks";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

import {
  buttonVariant,
  dashboardTaskFilter,
  rewardStatus,
  role,
  supportedLanguages,
  taskCategories,
  taskStatus,
} from "./constants";

export type ButtonVariant = (typeof buttonVariant)[keyof typeof buttonVariant];

export type FooterButton = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export type ButtonFooterProps = {
  buttons: FooterButton[];
};

export type ChildCard = {
  id: string;
  name: string;
  coins: number;
  color: string;
  progress: number;
  age: number;
  gender: ChildGender;
  loginCode: string;
  avatarId: string | null;
  avatarUrl: string | null;
  language?: AppLanguage | null;
  level?: number;
  xpTotal?: number;
  xpCurrentLevel?: number;
  xpNextLevel?: number;
  levelProgress?: number;
  coinBalance?: number;
};

export type IconType = (typeof Icons)[keyof typeof Icons];

export type StatItem = {
  key?: string;
  label: string;
  value: number;
  icon: IconType;
  color: string;
};

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];
export type TaskCategory = (typeof taskCategories)[keyof typeof taskCategories];
export type RewardStatus = (typeof rewardStatus)[keyof typeof rewardStatus];

export type TaskItem = {
  childId?: string;
  title: string;
  time: string;
  status: TaskStatus;
  id?: string;
  emoji?: string;
  coinReward?: number;
  xpReward?: number;
  description?: string;
  category?: TaskCategory | null;
  defaultTaskKey?: DefaultTaskKey | null;
  proofPhotoUrl?: string | null;
  repeatDays?: string[];
};

export type OnboardingTask = {
  id: string;
  emoji: string;
  title: string;
  selected: boolean;
  coins: number;
  category?: TaskCategory | null;
  defaultTaskKey?: DefaultTaskKey | null;
};

export type TaskSelection = OnboardingTask & {
  status?: TaskStatus;
};

export type DashboardTaskFilter = (typeof dashboardTaskFilter)[keyof typeof dashboardTaskFilter];

export type RewardItem = {
  id: string;
  childId: string;
  name: string;
  coinAmount: number;
  icon: string | null;
  imageUri: string | null;
  status: RewardStatus;
  requestedAt: string | null;
  givenAt: string | null;
};

export type AchievementStats = {
  currentTaskStreakDays: number;
  longestTaskStreakDays: number;
  currentPerfectWeekDays: number;
  longestPerfectWeekDays: number;
};

export type ChildAchievement = {
  id: string;
  childId: string;
  achievementId: string;
  unlockedAt: string;
  shownAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, unknown>;
};

export type ChildDetailsData = {
  child: ChildCard;
  tasks: TaskItem[];
  rewards: RewardItem[];
  achievementStats?: AchievementStats;
  childAchievements?: ChildAchievement[];
};

export type MultiSelectOption = {
  id: string;
  label: string;
  value: string;
};

export type RewardCard = {
  id: string;
  icon: string | null;
  imageUri?: string | null;
  title: string;
  coins: string;
  status?: RewardStatus;
};

export type AppLanguage = (typeof supportedLanguages)[number];

export type LanguageOption = {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  short: string;
};

export type ChildAvatarOption = {
  id: string;
  avatar: ImageSource;
};

export type RoleBackground = (typeof role)[keyof typeof role];

export type RoleTabItem = {
  name: string;
  title: string;
  icon: IconType;
  activeColor?: string;
};

export type TabValue = "list" | "map";
export type RewardsTabValue = "available" | "redeemed";

export type TabItem<TValue extends string = string> = {
  icon: IconType;
  title: string;
  value: TValue;
};

export type AchievementMetric =
  | "streakDays"
  | "xpTotal"
  | "completedTasks"
  | "uniqueCompletedTasks"
  | "level"
  | "perfectWeek"
  | "categoryCompletedTasks";

export type AchievementItem = {
  id: string;
  icon: string;
  metric: AchievementMetric;
  target: number;
  category?: string;
};

export type AchievementProgressItem = AchievementItem & {
  value: number;
  progress: number;
  progressLabel: string;
  unlocked: boolean;
  claimed: boolean;
  claimedAt?: string | null;
  unavailableReason?: string;
};
