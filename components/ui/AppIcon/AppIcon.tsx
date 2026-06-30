import { Icons } from "./icons";

type AppIconProps = {
  icon: (typeof Icons)[keyof typeof Icons];
  size?: number;
  color?: string;
};

export function AppIcon({ icon, size = 24, color = "black" }: AppIconProps) {
  const Icon = icon.library;

  return <Icon name={icon.name} size={size} color={color} />;
}
