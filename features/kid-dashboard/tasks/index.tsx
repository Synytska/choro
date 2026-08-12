import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { ChildTasksScreenSkeleton } from "@/components/ui/skeletons/kids/ChildTasksScreenSkeleton";
import { Palette } from "@/constants/theme";
import { ProgressRing } from "@/features/parent-dashboard/home/components/ProgressRing";
import { scrollViewTopKid } from "@/lib/constants";

import { QuestList } from "../home/components/QuestList";
import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";

export default function ChildrenTasksUI() {
  const { t } = useTranslation();

  const { child, doneTasks, tasks, isLoading } = useKidDashboardTasks();

  return (
    <ChildWrapper>
      <View style={styles.container}>
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
                <ThemedText child style={[styles.text1, styles.textWhite]}>
                  {t("kid.tasks.tasksDone", { done: doneTasks.length, all: tasks.length })}
                </ThemedText>
                <ThemedText mono style={styles.text2}>
                  {t("kid.tasks.missionProg")}
                </ThemedText>
                <View style={styles.label}>
                  <ThemedText child style={styles.text3}>
                    {/* TODO: Decide what to do with this text */}
                    +100 XP BONUS AT 100%
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
            <ThemedText child style={[styles.questList, styles.textWhite]}>
              {t("kid.tasks.qustList")}
            </ThemedText>
            <QuestList tasks={tasks} />
          </>
        )}
      </View>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: scrollViewTopKid,
    zIndex: 100,
    gap: 20,
    flex: 1,
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
  text1: {
    fontSize: 24,
  },
  textWhite: {
    color: Palette.white,
  },
  text2: {
    fontSize: 14,
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
    fontSize: 14,
    lineHeight: 16,
    color: Palette.green,
  },
  questList: {
    fontSize: 28,
  },
});
