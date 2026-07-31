import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/theme";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function TaskCardSkeleton({ child }: { child?: boolean }) {
  return (
    <ThemedView style={[styles.taskCard, child && { backgroundColor: Palette.darkNavy }]}>
      <View style={styles.taskLeft}>
        <SkeletonBlock width={40} height={40} radius="round" child={child} />
        <View style={styles.cardCopy}>
          <SkeletonBlock width={150} height={18} child={child} />
          <SkeletonBlock width={74} height={14} child={child} />
        </View>
      </View>
      <SkeletonBlock width={74} height={30} child={child} />
    </ThemedView>
  );
}
