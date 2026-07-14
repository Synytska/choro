import { View } from "react-native";

import { SkeletonBlock } from "@/components/ui/sceleton/SceletonBlock";
import { styles } from "@/components/ui/sceleton/styles";

export function ChildTabsSkeleton() {
  return (
    <View testID="child-tabs-skeleton" style={styles.tabsSkeleton}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} width={60} height={60} radius="round" />
      ))}
    </View>
  );
}
