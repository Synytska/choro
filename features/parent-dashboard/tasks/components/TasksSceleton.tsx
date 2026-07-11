import { View } from "react-native";

import { SkeletonBlock } from "@/components/ui/sceleton/SceletonBlock";
import { styles } from "@/components/ui/sceleton/styles";
import { TaskCardSkeleton } from "@/components/ui/sceleton/TaskCardSkeleton";

export function ChildTabsSkeleton() {
  return (
    <View testID="child-tabs-skeleton" style={styles.tabsSkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBlock key={index} width={116} height={86} radius={12} />
      ))}
    </View>
  );
}

export function TaskListSkeleton({ amount = 6 }: { amount?: number }) {
  return (
    <View testID="task-list-skeleton" style={styles.list}>
      {Array.from({ length: amount }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </View>
  );
}
