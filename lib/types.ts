import { ReactNode } from "react";

import { Icons } from "@/components/ui/AppIcon";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

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
};

export type AppIconConfig = (typeof Icons)[keyof typeof Icons];

export type StatItem = {
  label: string;
  value: number;
  icon: AppIconConfig;
  color: string;
};

export type TaskItem = {
  title: string;
  time: string;
  status: "done" | "pending";
  id?: string;
  emoji?: string;
};

export type OnboardingTask = {
  id: string;
  emoji: string;
  title: string;
  selected: boolean;
};

export type RewardItem = {
  id: string;
  name: string;
  coinAmount: number;
  imageUri: string | null;
};

export type ChildDetailsData = {
  child: ChildCard;
  tasks: TaskItem[];
  rewards: RewardItem[];
};
