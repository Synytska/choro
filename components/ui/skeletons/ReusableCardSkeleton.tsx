import { View } from "react-native";

import { styles } from "./styles";
import { TaskCardSkeleton } from "./TaskCardSkeleton";

export function ReusableCardSkeleton({ amount = 6 }: { amount?: number }) {
  return (
    <View testID="task-list-skeleton" style={styles.list}>
      {Array.from({ length: amount }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </View>
  );
}
