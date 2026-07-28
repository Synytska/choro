import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";

import { SkeletonBlock } from "../SkeletonBlock";
import { styles } from "./styles";
import { TasksSkeleton } from "./TasksSkeleton";

export function ChildTasksScreenSkeleton() {
  return (
    <View style={styles.gap16}>
      <ProgressCardSkeleton />
      <SkeletonBlock width={108} height={23} child />
      <TasksSkeleton />
    </View>
  );
}

function ProgressCardSkeleton() {
  return (
    <ThemedView child style={styles.progressCard}>
      <View style={styles.tasksWrapper}>
        <SkeletonBlock width={90} height={90} radius="round" child />
      </View>
      <View style={styles.tasksWrapper}>
        <SkeletonBlock width={152} height={23} child />
        <SkeletonBlock width={188} height={17} child />
        <SkeletonBlock width={155} height={22} child />
      </View>
    </ThemedView>
  );
}
