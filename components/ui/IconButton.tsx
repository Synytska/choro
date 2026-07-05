import { StyleSheet, TouchableOpacity } from "react-native";

import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

import { AppIcon, Icons } from "./AppIcon";

type IconButton = {
  icon?: (typeof Icons)[keyof typeof Icons];
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  iconSize?: number;
  onPress: () => void;
};

export function IconButton({
  icon = Icons.add,
  size = 48,
  borderColor,
  backgroundColor,
  iconSize = 24,
  onPress,
}: IconButton) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    wrapper: {
      backgroundColor: backgroundColor || colors.white,
      borderColor: borderColor || colors.orange,
      width: size,
      height: size,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.wrapper, dynamicStyles.wrapper, globalStyles.shadow]}
    >
      <AppIcon icon={icon} size={iconSize} color={borderColor || colors.orange} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
