import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ChildHomeScreenSkeleton } from "@/components/ui/skeletons/kids/ChildHomeScreenSkeleton";
import { useAppColors } from "@/hooks/use-app-colors";
import { scrollViewTopKid, taskStatus } from "@/lib/constants";
import { TabItem, TabValue } from "@/lib/types";

import { Badge } from "./components/Badge";
import { CoinStash } from "./components/CoinStash";
import { QuestList } from "./components/QuestList";
import { QuestMap } from "./components/QuestMap";
import { ToggleBar } from "./components/ToggleBar";
import { XpCard } from "./components/XpCard";
import { useKidDashboard } from "./hooks/useKidDashboard";

export default function ChildrenDashboardUI() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const { data: dashboardData, isLoading } = useKidDashboard();
  const child = dashboardData?.child;
  const tasks = dashboardData?.tasks;
  const pendingTasks = tasks?.filter((task) => task.status === taskStatus.pending);
  const doneTasks = tasks?.filter((task) => task.status === taskStatus.done);

  const [activeTab, setActiveTab] = useState<TabValue>("list");

  const tabs: TabItem[] = [
    {
      icon: Icons.menu,
      title: t("kid.home.list"),
      value: "list",
    },
    {
      icon: Icons.map,
      title: t("kid.home.map"),
      value: "map",
    },
  ];

  return (
    <ChildWrapper withStars>
      <CustomScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {isLoading ? (
          <ChildHomeScreenSkeleton />
        ) : (
          <>
            <XpCard
              doneTasks={doneTasks?.length}
              allTasks={tasks?.length}
              levelProgress={child?.levelProgress}
              xpCurrentLevel={child?.xpCurrentLevel}
              xpNextLevel={child?.xpNextLevel}
            />

            <View style={styles.wrapper}>
              <View style={styles.questContent}>
                <ThemedText child style={[styles.questTitle, { color: colors.white }]}>
                  {t("kid.home.activeQuests")}
                </ThemedText>
                <Badge
                  icon={Icons.assignment}
                  text={String(pendingTasks?.length)}
                  color={colors.orange}
                />
              </View>
              <ToggleBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              {activeTab === "list" ? (
                <QuestList tasks={tasks ?? []} />
              ) : (
                <QuestMap tasks={tasks ?? []} />
              )}
            </View>

            <CoinStash coinBalance={child?.coinBalance ?? child?.coins} xpTotal={child?.xpTotal} />
          </>
        )}
      </CustomScrollView>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 100,
    paddingTop: scrollViewTopKid,
  },
  scrollViewContainer: {
    gap: 16,
  },
  wrapper: {
    gap: 12,
  },
  questTitle: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  questContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
