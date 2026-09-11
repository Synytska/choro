import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ChildTasksScreenSkeleton } from "@/components/ui/skeletons/kids/ChildTasksScreenSkeleton";
import { Palette } from "@/constants/theme";
import { ProgressRing } from "@/features/parent-dashboard/home/components/ProgressRing";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { scrollViewTopKid, textType } from "@/lib/constants";

import { QuestList } from "../home/components/QuestList";
import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";

export default function ChildrenTasksUI() {
  const { t } = useTranslation();

  const { child, doneTasks, tasks, isLoading, refetch } = useKidDashboardTasks();
  const refreshControl = usePullToRefresh({ onRefresh: refetch });

  return (
    <ChildWrapper>
      <CustomScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshing={refreshControl.refreshing}
        onRefresh={refreshControl.onRefresh}
      >
        {isLoading ? (
          <ChildTasksScreenSkeleton />
        ) : (
          <>
            <ThemedView child style={styles.statsWrapper}>
              <ProgressRing
                ringSize={90}
                color={Palette.green}
                progress={child?.progress ?? 0}
                ringWidth={8}
                showPercent
                percentStyle={styles.textWhite}
              />

              <View style={styles.statsTextWrapper}>
                <ThemedText type={textType.subtitleChild} style={styles.textWhite}>
                  {t("kid.tasks.tasksDone", { done: doneTasks.length, all: tasks.length })}
                </ThemedText>
                <ThemedText mono style={styles.text2}>
                  {t("kid.tasks.missionProg")}
                </ThemedText>
                <View style={styles.label}>
                  <ThemedText mono style={styles.text3}>
                    {t("kid.tasks.addXP")}
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
            <ThemedText type={textType.titleChild} style={styles.textWhite}>
              {t("kid.tasks.qustList")}
            </ThemedText>
            <QuestList tasks={tasks} />
          </>
        )}
      </CustomScrollView>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    zIndex: 100,
  },
  container: {
    marginTop: scrollViewTopKid,
    gap: 20,
  },
  statsWrapper: {
    padding: 16,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statsTextWrapper: {
    alignItems: "flex-start",
    gap: 6,
  },
  textWhite: {
    color: Palette.white,
  },
  text2: {
    fontSize: 13,
    fontWeight: 700,
    color: Palette.darkGrey,
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: Palette.greenDone,
  },
  text3: {
    fontSize: 11,
    color: Palette.green,
    fontWeight: 800,
  },
});
