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
