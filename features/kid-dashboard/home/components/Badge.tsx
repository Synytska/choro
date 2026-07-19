import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { IconType } from "@/lib/types";

type BadgeProps = {
  icon: IconType;
  iconColor?: string;
  iconSize?: number;
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

export function Badge({
  icon,
  iconColor,
  iconSize = 14,
  text,
  style,
  textStyle,
  onPress,
}: BadgeProps) {
  const colors = useAppColors();
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={[styles.wrapper, style]}>
      <AppIcon icon={icon} size={iconSize} color={iconColor || colors.white} />
      <ThemedText mono style={[styles.title, { color: iconColor || colors.white }, textStyle]}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    lineHeight: 14,
    fontSize: 12,
    fontWeight: "800",
  },
});
