import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";

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

export type StatItem = {
  label: string;
  value: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
};

export type TaskItem = {
  title: string;
  time: string;
  status: "done" | "pending";
};
