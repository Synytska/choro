/**
 * Selectable task checklist used in onboarding and child add/edit modals.
 *
 * Props:
 * - tasks: list of OnboardingTask items with id, title, emoji, and selected state.
 * - showIcon: shows each task emoji before the title.
 * - onToggleTask: optional local toggle handler. If omitted, the component toggles onboarding Redux.
 * - renderSelectedContent: optional render prop for extra content shown below selected tasks.
 */
import { ReactNode, useCallback } from "react";
import { ListRenderItem, Pressable, StyleSheet, Text, View } from "react-native";

import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { OnboardingTask } from "@/lib/types";
import { toggleTask } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { CustomFlatList } from "../FlatList";
import { ThemedView } from "../themed-view";
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

  const handleToggleTask = useCallback(
    (taskId: string) => {
      if (onToggleTask) {
        onToggleTask(taskId);
        return;
      }

      dispatch(toggleTask(taskId));
    },
    [dispatch, onToggleTask],
  );

  const renderItem: ListRenderItem<OnboardingTask> = useCallback(
    ({ item }) => {
      const isSelected = item.selected;
      return (
        <ThemedView key={item.id} style={[styles.task, globalStyles.shadow]}>
          <View style={styles.wrapper}>
            <View style={styles.taskDetails}>
              {showIcon && <Text style={styles.taskEmoji}>{item.emoji}</Text>}
              <Text style={[styles.taskLabel, { color: colors.darkNavy }]}>{item.title}</Text>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={item.title}
              accessibilityState={{ checked: isSelected }}
              onPress={() => handleToggleTask(item.id)}
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

          {isSelected && renderSelectedContent?.(item)}
        </ThemedView>
      );
    },
    [colors, handleToggleTask, renderSelectedContent, showIcon],
  );
  return (
    <CustomFlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
  task: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
