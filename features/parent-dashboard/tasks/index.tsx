import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ChildCardComponent } from "@/components/ui/ChildCard";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useChildren } from "../children/hooks/useChildren";
import { useUpdateTasks } from "../children/hooks/useUpdateTasks";
import { ChildTabsSkeleton, TaskListSkeleton } from "./components/TasksSceleton";

type TaskOverride = {
  selected?: boolean;
  coins?: number;
};

export function ParentTasksUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();

  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const taskOptions = useAppSelector(selectOnboardingTasks);
  const updateTasks = useUpdateTasks();

  const children = dashboardData?.children ?? [];
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [taskOverridesByKey, setTaskOverridesByKey] = useState<Record<string, TaskOverride>>({});

  useEffect(() => {
    if (!selectedChildId && children[0]?.id) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const visibleTasks = useMemo(() => {
    const allSavedTasks = dashboardData?.tasks ?? [];
    const savedTasks = allSavedTasks.filter((task) => task.childId === selectedChildId);
    const savedTasksByTitle = new Map(savedTasks.map((task) => [task.title, task]));
    const optionTitles = new Set(taskOptions.map((task) => task.title));

    const optionTasks = taskOptions.map((task) => {
      const savedTask = savedTasksByTitle.get(task.title);
      const overrideKey = `${selectedChildId}:${task.id}`;
      const override = taskOverridesByKey[overrideKey];
      const selected = override?.selected ?? Boolean(savedTask);

      return {
        ...task,
        selected,
        coins: override?.coins ?? savedTask?.coinReward ?? task.coins,
        status: savedTask?.status ?? taskStatus.pending,
      };
    });

    const customTasksByTitle = new Map(
      allSavedTasks
        .filter((task) => !optionTitles.has(task.title))
        .map((task) => [task.title, task]),
    );

    const customTasks = Array.from(customTasksByTitle.values()).map((task) => {
      const savedTask = savedTasksByTitle.get(task.title);
      const taskId = savedTask?.id ?? `custom:${task.title}`;
      const overrideKey = `${selectedChildId}:${taskId}`;
      const override = taskOverridesByKey[overrideKey];

      return {
        id: taskId,
        emoji: savedTask?.emoji ?? task.emoji ?? "",
        title: task.title,
        selected: override?.selected ?? Boolean(savedTask),
        coins: override?.coins ?? savedTask?.coinReward ?? task.coinReward ?? 1,
        status: savedTask?.status ?? taskStatus.pending,
      };
    });

    return [...customTasks, ...optionTasks].sort(
      (firstTask, secondTask) => Number(secondTask.selected) - Number(firstTask.selected),
    );
  }, [dashboardData?.tasks, selectedChildId, taskOptions, taskOverridesByKey]);

  const dynamicStyles = StyleSheet.create({
    tab: {
      backgroundColor: colors.white,
    },
    taskWrapper: {
      backgroundColor: colors.white,
    },
  });

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    const overrideKey = `${selectedChildId}:${taskId}`;

    setTaskOverridesByKey((currentOverrides) => ({
      ...currentOverrides,
      [overrideKey]: {
        ...currentOverrides[overrideKey],
        coins: Math.max(1, nextValue),
      },
    }));
  };

  const toggleTask = (taskId: string) => {
    const currentTask = visibleTasks.find((task) => task.id === taskId);
    const overrideKey = `${selectedChildId}:${taskId}`;

    setTaskOverridesByKey((currentOverrides) => ({
      ...currentOverrides,
      [overrideKey]: {
        ...currentOverrides[overrideKey],
        selected: !currentTask?.selected,
      },
    }));
  };

  const onCreateTask = () => {
    router.push("/(role-parent)/tasks/create-task");
  };

  const onSaveTasks = () => {
    if (!selectedChildId) return;

    updateTasks.mutate({
      id: selectedChildId,
      tasks: visibleTasks,
    });
  };

  return (
    <PageView
      background="parent"
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: onSaveTasks,
          disabled: !selectedChildId || updateTasks.isPending,
        },
      ]}
    >
      <Header
        title={t("common.tasks")}
        icon={<IconButton round onPress={onCreateTask} iconSize={24} />}
      />

      <View style={styles.tabsContainer}>
        {isChildrenLoading && !dashboardData ? (
          <ChildTabsSkeleton />
        ) : (
          <View>
            <FlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChildCardComponent
                  item={item}
                  onPress={() => setSelectedChildId(item.id)}
                  isSelected={item.id === selectedChildId}
                />
              )}
              horizontal
              contentContainerStyle={styles.tabsWrapper}
            />
          </View>
        )}

        <View style={[styles.taskWrapper, dynamicStyles.taskWrapper, globalStyles.shadow]}>
          {isChildrenLoading && !dashboardData ? (
            <TaskListSkeleton amount={5} />
          ) : visibleTasks.length ? (
            <TaskList
              showIcon
              tasks={visibleTasks}
              onToggleTask={toggleTask}
              renderSelectedContent={(task) => (
                <TaskCoinReward
                  value={task.coins}
                  onIncrease={() => updateTaskCoinReward(task.id, task.coins + 1)}
                  onDecrease={() => updateTaskCoinReward(task.id, task.coins - 1)}
                />
              )}
            />
          ) : (
            <ThemedText type="subtitle">No tasks yet</ThemedText>
          )}
        </View>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    gap: 10,
    paddingTop: 24,
  },
  tab: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabText: {
    fontWeight: 700,
    fontSize: 14,
  },
  tabsContainer: {
    flex: 1,
  },
  taskWrapper: {
    flex: 1,
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
