import { StyleSheet, View } from "react-native";

import { SkeletonBlock } from "./SkeletonBlock";

export function ApproveTaskModalSkeleton() {
  return (
    <View testID="approve-task-modal-skeleton" style={styles.content}>
      <View style={styles.header}>
        <SkeletonBlock width={48} height={48} radius="round" />
        <View style={styles.headerText}>
          <SkeletonBlock width={160} height={24} />
          <SkeletonBlock width={120} height={16} />
        </View>
      </View>

      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <SkeletonBlock width={28} height={28} radius="round" />
          <View style={styles.taskText}>
            <SkeletonBlock width={150} height={20} />
            <SkeletonBlock width={210} height={16} />
          </View>
          <SkeletonBlock width={92} height={28} radius={14} />
        </View>

        <View style={styles.rewardRow}>
          <SkeletonBlock width={100} height={16} />
          <SkeletonBlock width={44} height={20} />
        </View>
      </View>

      <View style={styles.proofSection}>
        <SkeletonBlock width={120} height={18} />
        <SkeletonBlock width="100%" height={320} radius={18} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  taskCard: {
    borderRadius: 16,
    padding: 16,
    gap: 18,
    backgroundColor: 'white'
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  taskText: {
    flex: 1,
    gap: 8,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proofSection: {
    gap: 10,
  },
});
