import { ReactNode } from "react";

import { Icons } from "@/components/ui/AppIcon";

export type ButtonVariant = "primary" | "secondary" | "outline";

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
  name: string;
  coins: number;
  color: string;
  progress: number;
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
};
