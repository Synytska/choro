import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildCard } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useChildren } from "../children/hooks/useChildren";
import { useUpdateTasks } from "../children/hooks/useUpdateTasks";

type TaskOverride = {
  selected?: boolean;
  coins?: number;
};

export function ParentDashboardTasksUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
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
    const savedTasksByTitle = new Map(
      (dashboardData?.tasks ?? [])
        .filter((task) => task.childId === selectedChildId)
        .map((task) => [task.title, task]),
    );

    return taskOptions
      .map((task) => {
        const savedTask = savedTasksByTitle.get(task.title);
        const overrideKey = `${selectedChildId}:${task.id}`;
        const override = taskOverridesByKey[overrideKey];
        const selected = override?.selected ?? Boolean(savedTask);

        return {
          ...task,
          selected,
          coins: override?.coins ?? savedTask?.coinReward ?? task.coins,
        };
      })
      .sort((firstTask, secondTask) => Number(secondTask.selected) - Number(firstTask.selected));
  }, [dashboardData?.tasks, selectedChildId, taskOptions, taskOverridesByKey]);

  const dynamicStyles = StyleSheet.create({
    tab: {
      backgroundColor: colors.white,
    },
    taskWrapper: {
      backgroundColor: colors.white,
    },
  });

  //Render children tabs
  const renderItem: ListRenderItem<ChildCard> = ({ item }) => {
    const isSelected = item.id === selectedChildId;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => setSelectedChildId(item.id)}
        style={[styles.tab, isSelected && dynamicStyles.tab, isSelected && globalStyles.shadow]}
      >
        <ThemedText style={styles.tabText}>{item.name}</ThemedText>
      </TouchableOpacity>
    );
  };

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
      //   TODO: Add onpress
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: onSaveTasks,
          disabled: !selectedChildId || updateTasks.isPending,
        },
      ]}
      containerStyle={styles.pageView}
    >
      <View style={styles.headerWrapper}>
        <View style={styles.logoWrapper}>
          <LogoSmall />
          <ThemedText style={styles.header}>{t("common.tasks")}</ThemedText>
        </View>

        {/* TODO: Add onpress */}
        <IconButton onPress={() => {}} />
      </View>

      <View style={styles.tabsContainer}>
        <View>
          <FlatList
            data={children}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={styles.tabsWrapper}
          />
        </View>

        <View style={[styles.taskWrapper, dynamicStyles.taskWrapper, globalStyles.shadow]}>
          {isChildrenLoading ? (
            <ThemedText type="subtitle">Loading...</ThemedText>
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
  pageView: {
    paddingBottom: 10,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  header: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
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
    marginTop: -8,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
