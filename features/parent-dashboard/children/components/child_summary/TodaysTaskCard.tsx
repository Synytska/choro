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
import { StatusLabel } from "@/features/parent-dashboard/home/components/StatusLabel";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";
import { TaskItem } from "@/lib/types";

export function TodaysTaskCard({ task, onPress }: { task: TaskItem; onPress?: () => void }) {
  const colors = useAppColors();

  const isDone = task.status === taskStatus.done;
  const isReview = task.status === taskStatus.review;

  const dynamicStyles = StyleSheet.create({
    taskCard: {
      backgroundColor: colors.background,
      shadowColor: colors.darkNavy,
      borderColor: colors.middleGrey,
    },
    taskTime: {
      color: colors.darkGrey,
    },
    amountLabel: {
      backgroundColor: colors.lightBlue,
    },

    amountLabelText: {
      color: colors.darkGrey,
    },
  });

  return (
    <ThemedView style={[styles.card, dynamicStyles.taskCard, globalStyles.shadow]}>
      <View style={styles.taskLeft}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: isDone
                ? colors.progressGreen
                : isReview
                  ? colors.lightBlue
                  : colors.lightYellow,
            },
          ]}
        >
          <AppIcon
            icon={isDone ? Icons.check : isReview ? Icons.eye : Icons.pending}
            size={18}
            color={isDone ? colors.darkGreen : isReview ? colors.skyBlue : colors.orange}
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

      <View style={[styles.amountLabel, dynamicStyles.amountLabel]}>
        {/* Add real amount of coins */}
        <ThemedText style={[styles.amountText, dynamicStyles.amountLabelText]}>
          {task.coinReward}
        </ThemedText>
        <AppIcon icon={Icons.coins} size={14} color={colors.orange} />
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
  },

  amountText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    gap: 16,
  },
});
