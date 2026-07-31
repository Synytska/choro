import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function ChildSummaryCardSkeleton() {
  return (
    <ThemedView style={styles.childCard}>
      <SkeletonBlock width={52} height={52} radius="round" />
      <View style={styles.cardCopy}>
        <SkeletonBlock width={72} height={18} />
        <SkeletonBlock width={56} height={14} />
      </View>
    </ThemedView>
  );
}
