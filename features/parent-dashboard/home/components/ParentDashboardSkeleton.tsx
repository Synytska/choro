import { View } from "react-native";

import { ChildSummaryCardSkeleton } from "@/components/ui/sceleton/ChildSummaryCardSkeleton";
import { HeaderSkeleton } from "@/components/ui/sceleton/HeaderSkeleton";
import { SkeletonBlock } from "@/components/ui/sceleton/SceletonBlock";
import { StatsCardSkeleton } from "@/components/ui/sceleton/StatsCardSkeleton";
import { styles } from "@/components/ui/sceleton/styles";
import { TaskCardSkeleton } from "@/components/ui/sceleton/TaskCardSkeleton";

export function ParentDashboardSkeleton() {
  return (
    <View testID="parent-dashboard-skeleton" style={styles.screen}>
      <HeaderSkeleton />

      <View style={styles.section}>
        <SkeletonBlock width={96} height={18} />
        <View style={styles.childrenGrid}>
          <ChildSummaryCardSkeleton />
          <ChildSummaryCardSkeleton />
        </View>
      </View>

      <StatsCardSkeleton />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SkeletonBlock width={130} height={22} />
          <SkeletonBlock width={58} height={16} />
        </View>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </View>
    </View>
  );
}
