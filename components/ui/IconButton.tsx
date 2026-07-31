import { StyleSheet, TouchableOpacity } from "react-native";

import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { IconType } from "@/lib/types";

import { AppIcon, Icons } from "./AppIcon";

type IconButtonProps = {
  icon?: IconType;
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  iconSize?: number;
  onPress: () => void;
  round?: boolean;
};

export function IconButton({
  icon = Icons.add,
  size = 48,
  borderColor,
  backgroundColor,
  iconSize = 24,
  onPress,
  round = false,
}: IconButtonProps) {
  const dynamicStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: backgroundColor,
      borderColor: borderColor || Palette.orange,
      width: size,
      height: size,
      borderWidth: round ? 1 : 0,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      hitSlop={30}
      style={[styles.wrapper, dynamicStyles.wrapper, globalStyles.shadow]}
    >
      <AppIcon icon={icon} size={iconSize} color={borderColor || Palette.orange} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
