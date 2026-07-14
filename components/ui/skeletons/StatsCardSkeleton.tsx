import { View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function StatsCardSkeleton() {
  const colors = useAppColors();

  return (
    <View style={styles.statsRow}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} style={[styles.statItem, { backgroundColor: colors.white }]}>
          <SkeletonBlock width={48} height={14} />
          <SkeletonBlock width={24} height={24} />
        </View>
      ))}
    </View>
  );
}
