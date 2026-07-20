import { ImageSource } from "expo-image";
import { ReactNode } from "react";

import { Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

import { dashboardTaskFilter, role, supportedLanguages, taskStatus } from "./constants";

export type ButtonVariant = "primary" | "secondary" | "thirdly" | "outline";

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
};

export type OnboardingTask = {
  id: string;
  emoji: string;
  title: string;
  selected: boolean;
  coins: number;
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
};

export type ChildDetailsData = {
  child: ChildCard;
  tasks: TaskItem[];
  rewards: RewardItem[];
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
};

export type AppLanguage = (typeof supportedLanguages)[number];

export type LanguageOption = {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
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
  activeColor?: keyof ReturnType<typeof useAppColors>;
};

export type TabValue = "list" | "map";

export type TabItem = {
  icon: IconType;
  title: string;
  value: TabValue;
};
