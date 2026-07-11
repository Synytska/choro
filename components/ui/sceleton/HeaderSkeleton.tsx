import { View } from "react-native";

import { SkeletonBlock } from "./SceletonBlock";
import { styles } from "./styles";

export function HeaderSkeleton() {
  return (
    <View style={styles.header}>
      <SkeletonBlock width={48} height={48} radius={12} />
      <View style={styles.headerCopy}>
        <SkeletonBlock width={170} height={26} />
        <SkeletonBlock width={210} height={18} />
      </View>
      <SkeletonBlock width={48} height={48} radius="round" style={styles.headerAction} />
    </View>
  );
}
