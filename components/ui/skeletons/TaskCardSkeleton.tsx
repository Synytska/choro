import { View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { SkeletonBlock } from "./SkeletonBlock";
import { styles } from "./styles";

export function TaskCardSkeleton() {
  const colors = useAppColors();

  return (
    <View style={[styles.taskCard, { backgroundColor: colors.white }]}>
      <View style={styles.taskLeft}>
        <SkeletonBlock width={40} height={40} radius="round" />
        <View style={styles.cardCopy}>
          <SkeletonBlock width={150} height={18} />
          <SkeletonBlock width={74} height={14} />
        </View>
      </View>
      <SkeletonBlock width={74} height={30} />
    </View>
  );
}
