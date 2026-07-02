/**
 * Selectable task checklist used in onboarding and child add/edit modals.
 *
 * Props:
 * - tasks: list of OnboardingTask items with id, title, emoji, and selected state.
 * - showIcon: shows each task emoji before the title.
 * - onToggleTask: optional local toggle handler. If omitted, the component toggles onboarding Redux.
 * - renderSelectedContent: optional render prop for extra content shown below selected tasks.
 */
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { OnboardingTask } from "@/lib/types";
import { toggleTask } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { AppIcon, Icons } from "./AppIcon";

export function TaskList({
  tasks,
  showIcon = false,
  onToggleTask,
  renderSelectedContent,
}: {
  tasks: OnboardingTask[];
  showIcon?: boolean;
  onToggleTask?: (taskId: string) => void;
  renderSelectedContent?: (task: OnboardingTask) => ReactNode;
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
          <View key={task.id} style={[styles.task, { backgroundColor: colors.lightGrey }]}>
            <View style={styles.wrapper}>
              <View style={styles.taskDetails}>
                {showIcon && <Text style={styles.taskEmoji}>{task.emoji}</Text>}
                <Text style={[styles.taskLabel, { color: colors.darkNavy }]}>{task.title}</Text>
              </View>

              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel={task.title}
                accessibilityState={{ checked: isSelected }}
                onPress={() => handleToggleTask(task.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: colors.middleGrey,
                      backgroundColor: isSelected ? colors.orange : colors.white,
                    },
                  ]}
                >
                  {isSelected && <AppIcon icon={Icons.check} color={colors.white} size={16} />}
                </View>
              </Pressable>
            </View>

            {isSelected && renderSelectedContent?.(task)}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  task: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexGrow: 1,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
