import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

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
};

export function Badge({ icon, iconColor, iconSize = 14, text, style, textStyle }: BadgeProps) {
  const colors = useAppColors();
  return (
    <View style={[styles.wrapper, style]}>
      <AppIcon icon={icon} size={iconSize} color={iconColor || colors.white} />
      <ThemedText mono style={[styles.title, { color: iconColor || colors.white }, textStyle]}>
        {text}
      </ThemedText>
    </View>
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
