import { View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { SkeletonBlock } from "./SceletonBlock";
import { styles } from "./styles";

export function ChildSummaryCardSkeleton() {
  const colors = useAppColors();

  return (
    <View style={[styles.childCard, { backgroundColor: colors.white }]}>
      <SkeletonBlock width={52} height={52} radius="round" />
      <View style={styles.cardCopy}>
        <SkeletonBlock width={72} height={18} />
        <SkeletonBlock width={56} height={14} />
      </View>
    </View>
  );
}
