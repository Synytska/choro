/**
 * Four-column task stats summary for parent dashboard and child detail views.
 *
 * Props:
 * - totalAmount: total tasks shown as "Today".
 * - doneAmount: completed task count.
 * - pendingAmount: remaining task count.
 * - reviewAmount: tasks waiting for parent review.
 * - selectedFilter: currently active dashboard task filter.
 * - onFilterPress: called when the user selects a stats filter.
 */
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { dashboardTaskFilter } from "@/lib/constants";
import { DashboardTaskFilter, StatItem } from "@/lib/types";

export function StatsCard({
  totalAmount,
  doneAmount,
  pendingAmount,
  reviewAmount,
  selectedFilter = dashboardTaskFilter.today,
  onFilterPress,
}: {
  totalAmount: number;
  doneAmount: number;
  pendingAmount: number;
  reviewAmount: number;
  selectedFilter?: DashboardTaskFilter;
  onFilterPress?: (filter: DashboardTaskFilter) => void;
}) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const stats: (StatItem & { key: DashboardTaskFilter })[] = [
    {
      key: dashboardTaskFilter.today,
      label: t("common.status_labels.today"),
      value: totalAmount,
      icon: Icons.calendar,
      color: colors.darkGrey,
    },
    {
      key: dashboardTaskFilter.done,
      label: t("common.status_labels.done"),
      value: doneAmount,
      icon: Icons.done,
      color: colors.darkGreen,
    },
    {
      key: dashboardTaskFilter.pending,
      label: t("common.status_labels.left"),
      value: pendingAmount,
      icon: Icons.pending,
      color: colors.orange,
    },
    {
      key: dashboardTaskFilter.review,
      label: t("common.status_labels.review"),
      value: reviewAmount,
      icon: Icons.eye,
      color: colors.blue,
    },
  ];

  const dynamicStyles = StyleSheet.create({
    statLabel: {
      color: colors.darkGrey,
    },
  });
  return (
    <View style={styles.statsCard}>
      {stats.map((stat) => {
        const isSelected = selectedFilter === stat.key;

        return (
          <TouchableOpacity
            onPress={() => onFilterPress?.(stat.key)}
            key={stat.label}
            style={[
              styles.statItem,
              globalStyles.shadow,
              {
                backgroundColor: colors.background,
                borderColor: isSelected ? colors.orange : "transparent",
              },
            ]}
          >
            <View style={styles.statLabelRow}>
              <AppIcon icon={stat.icon} size={18} color={stat.color} />
              <ThemedText style={[styles.statLabel, dynamicStyles.statLabel]}>
                {stat.label}
              </ThemedText>
            </View>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
    minWidth: "49%",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
