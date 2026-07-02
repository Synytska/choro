/**
 * Task row used in the child detail "Today's Tasks" section.
 *
 * Props:
 * - task: title and status used to show pending/done icon and text styling.
 */
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { TaskItem } from "@/lib/types";

export function TodaysTaskCard({ task }: { task: TaskItem }) {
  const colors = useAppColors();

  const isDone = task.status === "done";

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
            { backgroundColor: isDone ? colors.lightGreen : colors.lightYellow },
          ]}
        >
          <AppIcon
            icon={isDone ? Icons.check : Icons.pending}
            size={18}
            color={isDone ? colors.darkGreen : colors.orange}
          />
        </View>
        <View style={styles.taskCopy}>
          <ThemedText style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
            {task.title}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.amountLabel, dynamicStyles.amountLabel]}>
        {/* Add real amount of coins */}
        <ThemedText style={[styles.amountText, dynamicStyles.amountLabelText]}>2</ThemedText>
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
  },
});
