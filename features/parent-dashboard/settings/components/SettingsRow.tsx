import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
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
  const colors = useAppColors();

  const contentColor = destructive ? colors.error : colors.darkNavy;

  const dynamicStyles = StyleSheet.create({
    appSettingsWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGrey,
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
        <ThemedText style={[styles.title, destructive && { color: colors.error }]}>
          {title}
        </ThemedText>
      </View>
      {rightContent}
    </TouchableOpacity>
  );
}
