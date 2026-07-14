import { View } from "react-native";

import { styles } from "@/components/ui/sceleton/styles";
import { TaskCardSkeleton } from "@/components/ui/sceleton/TaskCardSkeleton";

export function ReusableCardSceleton({ amount = 6 }: { amount?: number }) {
  return (
    <View testID="task-list-skeleton" style={styles.list}>
      {Array.from({ length: amount }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </View>
  );
}
