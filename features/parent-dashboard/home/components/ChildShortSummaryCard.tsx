/**
 * Compact child summary card shown on the parent home dashboard.
 *
 * Props:
 * - child: ChildCard data including name, coins, progress, and ring color.
 * - style: optional layout override used by responsive grid sizing.
 */
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CountBadge } from "@/components/ui/CountBadge";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ChildCard } from "@/lib/types";

import { ProgressRing } from "./ProgressRing";

export function ChildShortSummaryCard({
  child,
  style,
  onPress,
  badgeValue,
}: {
  child: ChildCard;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  badgeValue?: number;
}) {
  const background = useThemeColor(
    { light: Palette.white, dark: Palette.borderBlue },
    "background",
  );

  const dynamicStyles = StyleSheet.create({
    childCard: {
      backgroundColor: background,
      shadowColor: Palette.darkNavy,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.childCard, dynamicStyles.childCard, globalStyles.shadow, style]}
    >
      <ProgressRing color={child.color} progress={child.progress} />
      <View style={styles.childText}>
        <ThemedText style={styles.childName}>{child.name}</ThemedText>
        <View style={styles.coinRow}>
          <AppIcon icon={Icons.coins} size={14} color={Palette.orange} />
          <ThemedText type="subtitle" style={[styles.coinText]}>
            {child.coins}
          </ThemedText>
        </View>
      </View>
      {badgeValue ? <CountBadge title={badgeValue} style={styles.badge} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  childCard: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  childText: {
    flex: 1,
    gap: 2,
  },
  childName: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinText: {
    fontWeight: "700",
  },
  badge: {
    position: "relative",
  },
});
