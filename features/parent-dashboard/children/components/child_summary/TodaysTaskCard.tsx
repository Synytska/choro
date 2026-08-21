/**
 * Task row used in the child detail "Today's Tasks" section.
 *
 * Props:
 * - task: title and status used to show pending/done icon and text styling.
 */
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { StatusLabel } from "@/features/parent-dashboard/home/components/StatusLabel";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";
import { taskStatus } from "@/lib/constants";
import { TaskItem } from "@/lib/types";

export function TodaysTaskCard({ task, onPress }: { task: TaskItem; onPress?: () => void }) {
  const background = useThemeColor({}, "background");
  const isDone = task.status === taskStatus.done;
  const isReview = task.status === taskStatus.review;

  return (
    <ThemedView style={[styles.card, { backgroundColor: background }, globalStyles.shadow]}>
      <View style={styles.taskLeft}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: isDone
                ? Palette.progressGreen
                : isReview
                  ? Palette.lightBlue
                  : Palette.lightYellow,
            },
          ]}
        >
          <AppIcon
            icon={isDone ? Icons.check : isReview ? Icons.eye : Icons.pending}
            size={18}
            color={isDone ? Palette.darkGreen : isReview ? Palette.skyBlue : Palette.orange}
          />
        </View>
        <View style={styles.taskCopy}>
          <ThemedText style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
            {task.title}
          </ThemedText>
        </View>
      </View>
      {isReview && (
        <Pressable onPress={onPress} disabled={!onPress}>
          <StatusLabel status={task.status} />
        </Pressable>
      )}

      <View style={styles.amountLabel}>
        {/* Add real amount of coins */}
        <ThemedText style={styles.amountText}>{task.coinReward}</ThemedText>
        <AppIcon icon={Icons.coins} size={14} color={Palette.orange} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  taskCopy: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "grey",
  },
  amountLabel: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: Palette.lightBlue,
  },

  amountText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    color: Palette.darkGrey,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    gap: 16,
    shadowColor: Palette.darkNavy,
    borderColor: Palette.middleGrey,
  },
});
