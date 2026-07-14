import { View } from "react-native";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function ChildTabsSkeleton() {
  return (
    <View testID="child-tabs-skeleton" style={styles.tabsSkeleton}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} width={60} height={60} radius="round" />
      ))}
    </View>
  );
}
