/**
 * Small wrapper around the configured icon registry from Icons.
 *
 * Props:
 * - icon: one icon config from Icons.
 * - size/color: forwarded to the underlying icon library component.
 */
import { IconType } from "@/lib/types";

import { Icons } from "./icons";

type AppIconProps = {
  icon: IconType;
  size?: number;
  color?: string;
};

export function AppIcon({ icon, size = 24, color = "#6B7280" }: AppIconProps) {
  const Icon = icon.library;

  return <Icon name={icon.name} size={size} color={color} />;
}
