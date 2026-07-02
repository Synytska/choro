import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

export function ParentDashboardTasksUI() {
  const tasks = useAppSelector(selectOnboardingTasks);
  const { t } = useTranslation();
  const colors = useAppColors();

  const [taskCoinRewards, setTaskCoinRewards] = useState<Record<string, number>>({});

  const dynamicStyles = StyleSheet.create({
    tab: {
      backgroundColor: colors.white,
    },
    taskWrapper: {
      backgroundColor: colors.white,
    },
  });

  const getTaskCoinReward = (taskId: string) => taskCoinRewards[taskId] ?? 1;

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    setTaskCoinRewards((currentRewards) => ({
      ...currentRewards,
      [taskId]: Math.max(1, nextValue),
    }));
  };

  return (
    <PageView
      background="parent"
      //   TODO: Add onpress
      buttons={[{ title: t("common.saveChanges"), onPress: () => {}, variant: "thirdly" }]}
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
        <View style={styles.tabsWrapper}>
          <View style={[styles.tab, dynamicStyles.tab, globalStyles.shadow]}>
            <ThemedText style={styles.tabText}>Ella</ThemedText>
          </View>
          <View style={styles.tab}>
            <ThemedText style={styles.tabText}>Lily</ThemedText>
          </View>
          <View style={styles.tab}>
            <ThemedText style={styles.tabText}>Test</ThemedText>
          </View>
        </View>

        <View style={[styles.taskWrapper, dynamicStyles.taskWrapper, globalStyles.shadow]}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <TaskList
              showIcon
              tasks={tasks}
              renderSelectedContent={(task) => (
                <TaskCoinReward
                  value={getTaskCoinReward(task.id)}
                  onIncrease={() => updateTaskCoinReward(task.id, getTaskCoinReward(task.id) + 1)}
                  onDecrease={() => updateTaskCoinReward(task.id, getTaskCoinReward(task.id) - 1)}
                />
              )}
            />
          </ScrollView>
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
    flexDirection: "row",
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
  scrollView: {
    gap: 10,
  },
});
