import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { StatsCardSkeleton } from "@/components/ui/skeletons/StatsCardSkeleton";
import { styles } from "@/components/ui/skeletons/styles";
import { TaskCardSkeleton } from "@/components/ui/skeletons/TaskCardSkeleton";

export function ChildDetailsSkeleton() {
  return (
    <View testID="child-details-skeleton" style={styles.screen}>
      <View style={styles.childDetailsHeader}>
        <SkeletonBlock width={40} height={40} radius="round" />
        <SkeletonBlock width={140} height={28} />
        <SkeletonBlock width={40} height={40} radius="round" />
      </View>

      <ThemedView style={[styles.detailsHeroCard]}>
        <SkeletonBlock width={88} height={88} radius="round" />
        <SkeletonBlock width={130} height={24} />
        <SkeletonBlock width={90} height={18} />
      </ThemedView>

      <StatsCardSkeleton />

      <ThemedView style={[styles.progressCard]}>
        <SkeletonBlock width={130} height={22} />
        <SkeletonBlock width={120} height={120} radius="round" style={styles.centeredBlock} />
      </ThemedView>

      <View style={styles.section}>
        <SkeletonBlock width={130} height={22} />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </View>
    </View>
  );
}
