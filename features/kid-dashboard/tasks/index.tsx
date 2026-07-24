import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { ProgressRing } from "@/features/parent-dashboard/home/components/ProgressRing";
import { useAppColors } from "@/hooks/use-app-colors";
import { scrollViewTopKid, taskStatus } from "@/lib/constants";

import { QuestList } from "../home/components/QuestList";
import { useKidDashboard } from "../home/hooks/useKidDashboard";

export default function ChildrenTasksUI() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const { data: dashboardData, isLoading } = useKidDashboard();
  const child = dashboardData?.child;
  const tasks = dashboardData?.tasks;
  const doneTasks = tasks?.filter((task) => task.status === taskStatus.done);

  const dynamicStyles = StyleSheet.create({
    text: {
      color: colors.white,
    },
    text2: {
      color: colors.darkGrey,
    },
    label: {
      backgroundColor: colors.greenDone,
    },
    text3: {
      color: colors.green,
    },
  });

  return (
    <ChildWrapper>
      <View style={styles.container}>
        <ThemedView child style={styles.statsWrapper}>
          <ProgressRing
            ringSize={90}
            color={colors.green}
            progress={child?.progress ?? 0}
            ringWidth={8}
            showPercent
            percentStyle={dynamicStyles.text}
          />

          <View style={styles.statsTextWrapper}>
            <ThemedText child style={[styles.text1, dynamicStyles.text]}>
              {t("kid.tasks.tasksDone", { done: doneTasks?.length, all: tasks?.length })}
            </ThemedText>
            <ThemedText mono style={[styles.text2, dynamicStyles.text2]}>
              {t("kid.tasks.missionProg")}
            </ThemedText>
            <View style={[styles.label, dynamicStyles.label]}>
              <ThemedText child style={[styles.text3, dynamicStyles.text3]}>
                {/* TODO: Decide what to do with this text */}
                +100 XP BONUS AT 100%
              </ThemedText>
            </View>
          </View>
        </ThemedView>
        <ThemedText child style={[styles.questList, dynamicStyles.text]}>
          {t("kid.tasks.qustList")}
        </ThemedText>
        <QuestList tasks={tasks ?? []} />
      </View>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: scrollViewTopKid,
    zIndex: 100,
    gap: 16,
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
  text2: {
    fontSize: 14,
    fontWeight: 700,
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  },
  text3: {
    fontSize: 14,
    lineHeight: 16,
  },
  questList: {
    fontSize: 28,
  },
});
