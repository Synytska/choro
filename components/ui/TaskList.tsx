/**
 * Selectable task checklist used in onboarding and child add/edit modals.
 *
 * Props:
 * - tasks: list of OnboardingTask items with id, title, emoji, and selected state.
 * - showIcon: shows each task emoji before the title.
 * - onToggleTask: optional local toggle handler. If omitted, the component toggles onboarding Redux.
 * - renderSelectedContent: optional render prop for extra content shown below selected tasks.
 */
import { ReactElement, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { repeatDays } from "@/lib/constants";
import { getDefaultTaskTitle } from "@/lib/defaultTasks";
import { OnboardingTask, TaskSelection } from "@/lib/types";
import { toggleTask } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch } from "@/store/hooks";

import { CustomFlatList } from "../FlatList";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { AppIcon, Icons } from "./AppIcon";

export function TaskList({
  tasks,
  showIcon = false,
  onToggleTask,
  renderSelectedContent,
  renderTaskContainer,
  style,
  refreshing = false,
  onRefresh,
  scrollEnabled,
  onScrollBeginDrag,
}: {
  tasks: OnboardingTask[];
  showIcon?: boolean;
  onToggleTask?: (taskId: string) => void;
  renderSelectedContent?: (task: OnboardingTask) => ReactNode;
  renderTaskContainer?: (task: OnboardingTask, children: ReactElement) => ReactElement;
  style?: StyleProp<ViewStyle>;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const { t } = useTranslation();
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

  const renderItem: ListRenderItem<TaskSelection> = useCallback(
    ({ item }) => {
      const isSelected = item.selected;
      const title = getDefaultTaskTitle(item, t);
      const translatedRepeatDays = item.repeatDays.map((dayId) => {
        const day = repeatDays.find((day) => day.id === dayId);

        return day ? t(day.valueKey) : dayId;
      });

      const taskContent = (
        <ThemedView key={item.id} style={[styles.task, globalStyles.shadow]}>
          <View style={styles.wrapper}>
            <View style={styles.repeatWrapper}>
              {isSelected && (
                <ThemedText style={styles.repeatText}>
                  {item.repeatDays.length === 0
                    ? t("parent.tasks.onlyToday")
                    : translatedRepeatDays.join(", ")}
                </ThemedText>
              )}
              <View style={styles.taskDetails}>
                {showIcon && <Text style={styles.taskEmoji}>{item.emoji}</Text>}
                <ThemedText style={styles.taskLabel}>{title}</ThemedText>
              </View>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={title}
              accessibilityState={{ checked: isSelected }}
              onPress={() => handleToggleTask(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  { backgroundColor: isSelected ? Palette.orange : Palette.white },
                ]}
              >
                {isSelected && <AppIcon icon={Icons.check} color={Palette.white} size={16} />}
              </View>
            </Pressable>
          </View>

          {isSelected && renderSelectedContent?.(item)}
        </ThemedView>
      );

      return renderTaskContainer?.(item, taskContent) ?? taskContent;
    },
    [handleToggleTask, renderSelectedContent, renderTaskContainer, showIcon, t],
  );
  return (
    <CustomFlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={style}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEnabled={scrollEnabled}
      onScrollBeginDrag={onScrollBeginDrag}
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
    borderColor: Palette.middleGrey,
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
  repeatWrapper: {
    gap: 4,
  },
  repeatText: {
    fontSize: 10,
    color: Palette.darkGrey,
    fontWeight: "600",
  },
});
