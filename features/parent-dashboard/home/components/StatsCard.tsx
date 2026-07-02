/**
 * Four-column task stats summary for parent dashboard and child detail views.
 *
 * Props:
 * - totalAmount: total tasks shown as "Today".
 * - doneAmount: completed task count.
 * - pendingAmount: remaining task count.
 */
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { StatItem } from "@/lib/types";

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
    statLabel: {
      color: colors.darkGrey,
    },
  });
  return (
    <View style={styles.statsCard}>
      {stats.map((stat) => (
        <ThemedView key={stat.label} style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <AppIcon icon={stat.icon} size={16} color={stat.color} />
            <ThemedText style={[styles.statLabel, dynamicStyles.statLabel]}>
              {stat.label}
            </ThemedText>
          </View>
          <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
    elevation: 2,
    paddingVertical: 10,
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
