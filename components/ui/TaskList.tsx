/**
 * Selectable task checklist used in onboarding and child add/edit modals.
 *
 * Props:
 * - tasks: list of OnboardingTask items with id, title, emoji, and selected state.
 * - showIcon: shows each task emoji before the title.
 * - onToggleTask: optional local toggle handler. If omitted, the component toggles onboarding Redux.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { OnboardingTask } from "@/lib/types";
import { toggleTask } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

export function TaskList({
  tasks,
  showIcon = false,
  onToggleTask,
}: {
  tasks: OnboardingTask[];
  showIcon?: boolean;
  onToggleTask?: (taskId: string) => void;
}) {
  const colors = useAppColors();
  const dispatch = useAppDispatch();

  const handleToggleTask = (taskId: string) => {
    if (onToggleTask) {
      onToggleTask(taskId);
      return;
    }

    dispatch(toggleTask(taskId));
  };

  return (
    <>
      {tasks.map((task) => {
        const isSelected = task.selected;

        return (
          <Pressable
            key={task.id}
            accessibilityRole="checkbox"
            accessibilityLabel={task.title}
            accessibilityState={{ checked: isSelected }}
            onPress={() => handleToggleTask(task.id)}
            style={[styles.task, { backgroundColor: colors.lightGrey }]}
          >
            <View style={styles.taskDetails}>
              {showIcon && <Text style={styles.taskEmoji}>{task.emoji}</Text>}
              <Text style={[styles.taskLabel, { color: colors.darkNavy }]}>{task.title}</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isSelected ? colors.darkNavy : colors.middleGrey,
                  backgroundColor: isSelected ? colors.darkNavy : colors.white,
                },
              ]}
            >
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  task: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexGrow: 1,
  },
  taskLabel: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  taskEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
});
