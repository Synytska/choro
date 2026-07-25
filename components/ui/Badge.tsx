import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { IconType } from "@/lib/types";

type BadgeProps = {
  icon?: IconType;
  emoji?: string;
  color?: string;
  iconSize?: number;
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  emojiStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

export function Badge({
  icon,
  emoji,
  emojiStyle,
  color,
  iconSize = 14,
  text,
  style,
  textStyle,
  onPress,
}: BadgeProps) {
  const colors = useAppColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.wrapper,
        style,
        { borderColor: color || colors.orange, shadowColor: color },
        globalStyles.kidShadow,
      ]}
    >
      {icon && <AppIcon icon={icon} size={iconSize} color={color || colors.white} />}
      {emoji && <Text style={emojiStyle}>{emoji}</Text>}
      <ThemedText mono style={[styles.title, { color: color || colors.white }, textStyle]}>
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
    borderWidth: 2,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  title: {
    lineHeight: 14,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
