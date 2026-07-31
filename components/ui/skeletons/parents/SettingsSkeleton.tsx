import { View } from "react-native";

import { styles } from "@/components/ui/skeletons/styles";
import { TaskCardSkeleton } from "@/components/ui/skeletons/TaskCardSkeleton";

export function SettingsChildrenSkeleton() {
  return (
    <View testID="settings-children-skeleton" style={styles.list}>
      {Array.from({ length: 2 }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </View>
  );
}
