import { FontAwesome5 } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildCard } from "@/lib/types";

import { ProgressRing } from "./ProgressRing";

export function ChildSummaryCard({
  child,
  style,
}: {
  child: ChildCard;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    childCard: {
      backgroundColor: colors.white,
      shadowColor: colors.darkNavy,
    },
  });

  return (
    <ThemedView style={[styles.childCard, dynamicStyles.childCard, style]}>
      <ProgressRing color={child.color} progress={child.progress} />
      <View style={styles.childText}>
        <ThemedText style={styles.childName}>{child.name}</ThemedText>
        <View style={styles.coinRow}>
          <FontAwesome5 name="coins" size={14} color={colors.orange} />
          <ThemedText type="subtitle" style={[styles.coinText]}>
            {child.coins}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  childCard: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 2,
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
});
