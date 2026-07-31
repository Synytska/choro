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
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";
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
  const { t } = useTranslation();
  const background = useThemeColor({}, "background");

  const stats: (StatItem & { key: DashboardTaskFilter })[] = [
    {
      key: dashboardTaskFilter.today,
      label: t("common.status_labels.today"),
      value: totalAmount,
      icon: Icons.calendar,
      color: Palette.darkGrey,
    },
    {
      key: dashboardTaskFilter.done,
      label: t("common.status_labels.done"),
      value: doneAmount,
      icon: Icons.done,
      color: Palette.darkGreen,
    },
    {
      key: dashboardTaskFilter.pending,
      label: t("common.status_labels.left"),
      value: pendingAmount,
      icon: Icons.pending,
      color: Palette.orange,
    },
    {
      key: dashboardTaskFilter.review,
      label: t("common.status_labels.review"),
      value: reviewAmount,
      icon: Icons.eye,
      color: Palette.blue,
    },
  ];

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
                backgroundColor: background,
                borderColor: isSelected ? Palette.orange : "transparent",
              },
            ]}
          >
            <View style={styles.statLabelRow}>
              <AppIcon icon={stat.icon} size={18} color={stat.color} />
              <ThemedText
                darkColor={Palette.white}
                lightColor={Palette.darkGrey}
                style={styles.statLabel}
              >
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
