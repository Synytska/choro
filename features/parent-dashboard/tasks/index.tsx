import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { ThemedText } from "@/components/themed-text";
import { ChildTabsComponent } from "@/components/ui/ChildTabs";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ChildTabsSkeleton } from "@/components/ui/skeletons/ChildTabsSkeleton";
import { ReusableCardSkeleton } from "@/components/ui/skeletons/ReusableCardSkeleton";
import SwipeToDelete from "@/components/ui/SwipeToDelete";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSwipeToDeleteList } from "@/hooks/useSwipeToDeleteList";
import { role, scrollViewTop, taskStatus } from "@/lib/constants";
import { getDefaultTaskIdentity, getDefaultTaskTitle } from "@/lib/defaultTasks";
import { TaskSelection } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useChildren } from "../children/hooks/useChildren";
import { useUpdateTasks } from "../children/hooks/useUpdateTasks";
import { useDeleteTask } from "./hooks/useDeleteTask";

type TaskOverride = {
  selected?: boolean;
  coins?: number;
};
type VisibleTask = TaskSelection & {
  saved: boolean;
  isDefault: boolean;
  taskDbId?: string;
};

export function ParentTasksUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { childId } = useLocalSearchParams<{ childId?: string }>();

  const { data: dashboardData, isLoading: isChildrenLoading, refetch } = useChildren();
  const taskOptions = useAppSelector(selectOnboardingTasks);
  const updateTasks = useUpdateTasks();
  const deleteTask = useDeleteTask();
  const {
    closeAllSwipeables,
    handleSwipeEnd,
    handleSwipeOpen,
    handleSwipeStart,
    isScrollEnabled,
    setSwipeableRef,
  } = useSwipeToDeleteList();

  const children = useMemo(() => dashboardData?.children ?? [], [dashboardData?.children]);
  const [selectedChild, setSelectedChild] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const [taskOverridesByKey, setTaskOverridesByKey] = useState<Record<string, TaskOverride>>({});

  useEffect(() => {
    const childFromParams = childId ? children.find((child) => child.id === childId) : undefined;

    if (childFromParams && childFromParams.id !== selectedChild.id) {
      setSelectedChild({ name: childFromParams.name, id: childFromParams.id });

      return;
    }

    if (!selectedChild.id && children[0]?.id) {
      setSelectedChild({ id: children[0].id, name: children[0].name });
    }
  }, [childId, children, selectedChild.id]);

  const visibleTasks = useMemo<VisibleTask[]>(() => {
    const allSavedTasks = dashboardData?.tasks ?? [];
    const savedTasks = allSavedTasks.filter((task) => task.childId === selectedChild.id);
    const savedTasksByTitle = new Map(
      savedTasks.map((task) => [getDefaultTaskIdentity(task), task]),
    );
    const optionTitles = new Set(taskOptions.map(getDefaultTaskIdentity));

    const optionTasks = taskOptions.map((task) => {
      const savedTask = savedTasksByTitle.get(getDefaultTaskIdentity(task));
      const overrideKey = `${selectedChild.id}:${task.id}`;
      const override = taskOverridesByKey[overrideKey];

      return {
        ...task,
        id: task.id,
        selected: override?.selected ?? Boolean(savedTask),
        saved: Boolean(savedTask),
        isDefault: true,
        taskDbId: savedTask?.id,
        coins: override?.coins ?? savedTask?.coinReward ?? task.coins,
        category: savedTask?.category ?? task.category ?? null,
        status: savedTask?.status ?? taskStatus.pending,
        childId: selectedChild.id,
        title: task.title,
        time: savedTask?.time ?? "",
        emoji: task.emoji,
        repeatDays: savedTask?.repeatDays ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        taskType: "default" as const,
      };
    });

    const customTasksByTitle = new Map(
      allSavedTasks
        .filter(
          (task) =>
            task.childId === selectedChild.id && !optionTitles.has(getDefaultTaskIdentity(task)),
        )
        .map((task) => [getDefaultTaskIdentity(task), task]),
    );

    const customTasks = Array.from(customTasksByTitle.values()).map((task) => {
      const savedTask = savedTasksByTitle.get(getDefaultTaskIdentity(task));
      const taskId = savedTask?.id ?? task.id ?? `custom:${task.title}`;
      const overrideKey = `${selectedChild.id}:${taskId}`;
      const override = taskOverridesByKey[overrideKey];
      const repeatDays = savedTask?.repeatDays ?? task.repeatDays ?? [];
      const taskType = repeatDays.length > 0 ? ("recurring" as const) : ("one-time" as const);

      return {
        id: taskId,
        taskDbId: savedTask?.id,
        childId: selectedChild.id,
        title: task.title,
        time: savedTask?.time ?? "",
        status: savedTask?.status ?? task.status ?? taskStatus.pending,

        emoji: savedTask?.emoji ?? task.emoji ?? "",
        selected: override?.selected ?? Boolean(savedTask),
        saved: Boolean(savedTask),
        isDefault: false,
        coins: override?.coins ?? savedTask?.coinReward ?? task.coinReward ?? 1,
        category: savedTask?.category ?? task.category ?? null,
        defaultTaskKey: savedTask?.defaultTaskKey ?? task.defaultTaskKey ?? null,
        proofPhotoUrl: savedTask?.proofPhotoUrl ?? null,
        repeatDays,
        taskType,
      };
    });

    return [...customTasks, ...optionTasks].sort(
      (firstTask, secondTask) => Number(secondTask.saved) - Number(firstTask.saved),
    );
  }, [dashboardData?.tasks, selectedChild, taskOptions, taskOverridesByKey]);

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedChild.id) return false;

    const allSavedTasks = dashboardData?.tasks ?? [];
    const savedTasks = allSavedTasks.filter((task) => task.childId === selectedChild.id);
    const savedTasksByTitle = new Map(
      savedTasks.map((task) => [getDefaultTaskIdentity(task), task]),
    );
    const optionTitles = new Set(taskOptions.map(getDefaultTaskIdentity));
    const baseTasksById = new Map<string, { selected: boolean; coins: number }>();

    taskOptions.forEach((task) => {
      const savedTask = savedTasksByTitle.get(getDefaultTaskIdentity(task));

      baseTasksById.set(task.id, {
        selected: Boolean(savedTask),
        coins: savedTask?.coinReward ?? task.coins,
      });
    });

    allSavedTasks
      .filter((task) => !optionTitles.has(getDefaultTaskIdentity(task)))
      .forEach((task) => {
        const savedTask = savedTasksByTitle.get(getDefaultTaskIdentity(task));
        const taskId = savedTask?.id ?? task.id ?? `custom:${task.title}`;

        baseTasksById.set(taskId, {
          selected: Boolean(savedTask),
          coins: savedTask?.coinReward ?? task.coinReward ?? 1,
        });
      });

    return visibleTasks.some((task) => {
      const baseTask = task.id && baseTasksById.get(task.id);

      if (!baseTask) return true;

      if (baseTask.selected !== task.selected) return true;
      if (!task.selected) return false;

      return baseTask.coins !== task.coins;
    });
  }, [dashboardData?.tasks, selectedChild.id, taskOptions, visibleTasks]);
  const isSaveDisabled = !selectedChild.id || !hasUnsavedChanges || updateTasks.isPending;

  useEffect(() => {
    if (childId || hasUnsavedChanges) return;

    const lastCreatedChildId = queryClient.getQueryData<string>(["children", "lastCreatedChildId"]);
    const lastCreatedChild = lastCreatedChildId
      ? children.find((child) => child.id === lastCreatedChildId)
      : undefined;

    if (!lastCreatedChild) return;

    if (lastCreatedChild.id !== selectedChild.id) {
      setSelectedChild({
        id: lastCreatedChild.id,
        name: lastCreatedChild.name,
      });
    }

    queryClient.removeQueries({
      exact: true,
      queryKey: ["children", "lastCreatedChildId"],
    });
  }, [childId, children, hasUnsavedChanges, queryClient, selectedChild.id]);

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    const overrideKey = `${selectedChild.id}:${taskId}`;

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
    const overrideKey = `${selectedChild.id}:${taskId}`;

    setTaskOverridesByKey((currentOverrides) => ({
      ...currentOverrides,
      [overrideKey]: {
        ...currentOverrides[overrideKey],
        selected: !currentTask?.selected,
      },
    }));
  };

  const onCreateTask = () => {
    if (!selectedChild.id) return;

    closeAllSwipeables();
    router.push({
      pathname: "/(role-parent)/tasks/create-task",
      params: { childId: selectedChild.id },
    });
  };

  const resetTaskOverridesForChild = (childIdToReset: string) => {
    const overridePrefix = `${childIdToReset}:`;

    setTaskOverridesByKey((currentOverrides) =>
      Object.entries(currentOverrides).reduce<Record<string, TaskOverride>>(
        (nextOverrides, [overrideKey, override]) => {
          if (!overrideKey.startsWith(overridePrefix)) {
            nextOverrides[overrideKey] = override;
          }

          return nextOverrides;
        },
        {},
      ),
    );
  };

  const onSaveTasks = () => {
    if (isSaveDisabled) return;

    closeAllSwipeables();
    updateTasks.mutate(
      {
        id: selectedChild.id,
        tasks: visibleTasks,
      },
      {
        onSuccess: () => resetTaskOverridesForChild(selectedChild.id),
      },
    );
  };

  const selectChild = (name: string, id: string) => {
    setSelectedChild({ name, id });
  };

  const refreshControl = usePullToRefresh({
    onRefresh: refetch,
    shouldRefresh: () => {
      if (!hasUnsavedChanges) return true;

      Alert.alert(
        t("parent.tasks.unsavedChangesTitle"),
        t("parent.tasks.unsavedChangesMessage", {
          name: selectedChild.name,
        }),
      );

      return false;
    },
  });

  const onRefresh = () => {
    refreshControl.onRefresh();
  };

  const onChildTabPress = (name: string, id: string) => {
    if (id === selectedChild.id || updateTasks.isPending) return;

    closeAllSwipeables();

    if (hasUnsavedChanges) {
      Alert.alert(
        t("parent.tasks.unsavedChangesTitle"),
        t("parent.tasks.unsavedChangesMessage", { name: selectedChild.name }),
        [
          {
            text: t("parent.tasks.keepEditing"),
            style: "cancel",
          },
          {
            text: t("parent.tasks.discardChanges"),
            style: "destructive",
            onPress: () => {
              resetTaskOverridesForChild(selectedChild.id);
              selectChild(name, id);
            },
          },
          {
            text: t("common.save"),
            style: "default",
            onPress: () => {
              updateTasks.mutate(
                {
                  id: selectedChild.id,
                  tasks: visibleTasks,
                },
                {
                  onSuccess: () => {
                    resetTaskOverridesForChild(selectedChild.id);
                    selectChild(name, id);
                  },
                },
              );
            },
          },
        ],
      );

      return;
    }

    selectChild(name, id);
  };

  const onDeleteTaskPress = (taskId: string) => {
    if (deleteTask.isPending) return;

    const task = visibleTasks.find((item) => item.id === taskId);

    if (!task) return;

    if (hasUnsavedChanges) {
      Alert.alert(
        t("parent.tasks.unsavedChangesTitle"),
        t("parent.tasks.unsavedChangesMessage", { name: selectedChild.name }),
      );
      closeAllSwipeables();
      return;
    }

    const taskDbId = "taskDbId" in task ? task.taskDbId : undefined;
    const isDefault = "isDefault" in task ? Boolean(task.isDefault) : false;

    if (!isDefault && !taskDbId) {
      closeAllSwipeables();
      return;
    }

    Alert.alert(
      t("parent.tasks.deleteTaskConfirmTitle", { title: getDefaultTaskTitle(task, t) }),
      t("parent.tasks.deleteTaskConfirmMessage", { name: selectedChild.name }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: closeAllSwipeables,
        },
        {
          text: t("common.remove"),
          style: "destructive",
          onPress: () =>
            deleteTask.mutate({
              childId: selectedChild.id,
              taskId: taskDbId,
              title: task.title,
              defaultTaskKey: task.defaultTaskKey ?? null,
              isDefault,
            }),
        },
      ],
    );
  };

  return (
    <PageView
      screen={role.parent}
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: onSaveTasks,
          disabled: isSaveDisabled,
        },
      ]}
    >
      <Header title={t("common.tasks")} />

      <View style={styles.tabsContainer}>
        {isChildrenLoading && !dashboardData ? (
          <View style={styles.tabsWrapper}>
            <ChildTabsSkeleton />
          </View>
        ) : (
          <View>
            <CustomFlatList
              data={children}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChildTabsComponent
                  item={item}
                  onPress={() => onChildTabPress(item.name, item.id)}
                  isSelected={item.id === selectedChild.id}
                />
              )}
              horizontal
              contentContainerStyle={styles.tabsWrapper}
            />
          </View>
        )}

        <View style={styles.childTitleWrapper}>
          <ThemedText style={styles.name}>{selectedChild.name}</ThemedText>
          <IconButton round size={36} iconSize={20} onPress={onCreateTask} />
        </View>

        {isChildrenLoading && !dashboardData ? (
          <ReusableCardSkeleton amount={5} />
        ) : visibleTasks.length ? (
          <TaskList
            showIcon
            tasks={visibleTasks}
            onToggleTask={toggleTask}
            refreshing={refreshControl.refreshing}
            onRefresh={onRefresh}
            scrollEnabled={isScrollEnabled}
            onScrollBeginDrag={closeAllSwipeables}
            renderTaskContainer={(task, children) => {
              const canDeleteTask =
                ("isDefault" in task && task.isDefault) || ("taskDbId" in task && task.taskDbId);

              if (!canDeleteTask) return children;

              return (
                <SwipeToDelete
                  ref={setSwipeableRef(task.id)}
                  item={task}
                  handleSwipeOpen={handleSwipeOpen}
                  handleDelete={onDeleteTaskPress}
                  onSwipeStart={handleSwipeStart}
                  onSwipeEnd={handleSwipeEnd}
                >
                  {children}
                </SwipeToDelete>
              );
            }}
            renderSelectedContent={(task) => (
              <TaskCoinReward
                value={task.coins}
                onIncrease={() => updateTaskCoinReward(task.id, task.coins + 1)}
                onDecrease={() => updateTaskCoinReward(task.id, task.coins - 1)}
              />
            )}
          />
        ) : (
          <ThemedText type="subtitle">{t("common.empty.noTasksYet")}</ThemedText>
        )}
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    gap: 10,
    paddingTop: scrollViewTop,
  },
  tabsContainer: {
    flex: 1,
    gap: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  childTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
