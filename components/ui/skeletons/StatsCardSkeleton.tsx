import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function StatsCardSkeleton() {
  return (
    <View style={styles.statsRow}>
      {Array.from({ length: 4 }).map((_, index) => (
        <ThemedView key={index} style={[styles.statItem]}>
          <SkeletonBlock width={48} height={14} />
          <SkeletonBlock width={24} height={24} />
        </ThemedView>
      ))}
    </View>
  );
}
