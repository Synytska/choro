import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IconType } from "@/lib/types";

import { styles } from "../styles";

type SettingsRowProps = {
  title: string;
  icon: IconType;
  onPress?: () => void;
  rightContent?: ReactNode;
  destructive?: boolean;
  showDivider?: boolean;
};

export function SettingsRow({
  icon,
  onPress,
  title,
  rightContent,
  showDivider = true,
  destructive,
}: SettingsRowProps) {
  const iconColor = useThemeColor({ light: Palette.darkNavy }, "icon");
  const border = useThemeColor({ light: Palette.darkNavy }, "border");

  const contentColor = destructive ? Palette.error : iconColor;

  const dynamicStyles = StyleSheet.create({
    appSettingsWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: border,
      paddingBottom: 12,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.appSettingsWrapper, showDivider && dynamicStyles.appSettingsWrapper]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.commonWrapper}>
        <AppIcon icon={icon} size={22} color={contentColor} />
        <ThemedText style={[styles.title, destructive && { color: Palette.error }]}>
          {title}
        </ThemedText>
      </View>
      {rightContent}
    </TouchableOpacity>
  );
}
