import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { StatItem } from "@/lib/types";

import { parentStyles } from "../../styles";

export function StatsCard({
  totalAmount,
  doneAmount,
  pendingAmount,
}: {
  totalAmount: number;
  doneAmount: number;
  pendingAmount: number;
}) {
  const colors = useAppColors();

  //TODO: Replace with dynamic values
  const stats: StatItem[] = [
    {
      label: "Today",
      value: totalAmount,
      icon: Icons.calendar,
      color: "#6B7280",
    },
    {
      label: "Done",
      value: doneAmount,
      icon: Icons.done,
      color: "#10B981",
    },
    {
      label: "Left",
      value: pendingAmount,
      icon: Icons.pending,
      color: "#F59E0B",
    },
    {
      label: "Review",
      value: doneAmount,
      icon: Icons.eye,
      color: "#635BFF",
    },
  ];

  const dynamicStyles = StyleSheet.create({
    statsCard: {
      backgroundColor: colors.background,
      shadowColor: colors.darkNavy,
    },
    statLabel: {
      color: colors.darkGrey,
    },
  });
  return (
    <ThemedView style={[parentStyles.card, dynamicStyles.statsCard]}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <AppIcon icon={stat.icon} size={16} color={stat.color} />
            <ThemedText style={[styles.statLabel, dynamicStyles.statLabel]}>
              {stat.label}
            </ThemedText>
          </View>
          <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  statItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});
