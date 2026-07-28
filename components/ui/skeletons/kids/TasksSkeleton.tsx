import { View } from "react-native";

import { TaskCardSkeleton } from "../TaskCardSkeleton";
import { styles } from "./styles";

export function TasksSkeleton() {
  return (
    <View style={styles.gap16}>
      {Array.from({ length: 3 }).map((_, index) => (
        <TaskCardSkeleton child key={index} />
      ))}
    </View>
  );
}
