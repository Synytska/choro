import { View } from "react-native";

import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { StatsCardSkeleton } from "@/components/ui/skeletons/StatsCardSkeleton";
import { styles } from "@/components/ui/skeletons/styles";
import { TaskCardSkeleton } from "@/components/ui/skeletons/TaskCardSkeleton";
import { useAppColors } from "@/hooks/use-app-colors";

export function ChildDetailsSkeleton() {
  const colors = useAppColors();

  return (
    <View testID="child-details-skeleton" style={styles.screen}>
      <View style={styles.childDetailsHeader}>
        <SkeletonBlock width={40} height={40} radius="round" />
        <SkeletonBlock width={140} height={28} />
        <SkeletonBlock width={40} height={40} radius="round" />
      </View>

      <View style={[styles.detailsHeroCard, { backgroundColor: colors.white }]}>
        <SkeletonBlock width={88} height={88} radius="round" />
        <SkeletonBlock width={130} height={24} />
        <SkeletonBlock width={90} height={18} />
      </View>

      <StatsCardSkeleton />

      <View style={[styles.progressCard, { backgroundColor: colors.white }]}>
        <SkeletonBlock width={130} height={22} />
        <SkeletonBlock width={120} height={120} radius="round" style={styles.centeredBlock} />
      </View>

      <View style={styles.section}>
        <SkeletonBlock width={130} height={22} />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </View>
    </View>
  );
}
