import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
      icon: "calendar-today",
      color: "#6B7280",
    },
    {
      label: "Done",
      value: doneAmount,
      icon: "task-alt",
      color: "#10B981",
    },
    {
      label: "Left",
      value: pendingAmount,
      icon: "schedule",
      color: "#F59E0B",
    },
    {
      label: "Review",
      value: doneAmount,
      icon: "visibility",
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
    <ThemedView style={[styles.statsCard, dynamicStyles.statsCard]}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.statItem}>
          <View style={styles.statLabelRow}>
            <MaterialIcons name={stat.icon} size={16} color={stat.color} />
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
  statsCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
    elevation: 2,
  },
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
