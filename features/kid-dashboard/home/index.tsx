import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ChildHomeScreenSkeleton } from "@/components/ui/skeletons/kids/ChildHomeScreenSkeleton";
import { ToggleBar } from "@/components/ui/ToggleBar";
import { Palette } from "@/constants/theme";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { scrollViewTopKid } from "@/lib/constants";
import { TabItem, TabValue } from "@/lib/types";

import { CoinStash } from "./components/CoinStash";
import { QuestList } from "./components/QuestList";
import { QuestMap } from "./components/QuestMap";
import { XpCard } from "./components/XpCard";
import { useKidDashboardTasks } from "./hooks/useKidDashboardTasks";

export default function ChildrenDashboardUI() {
  const { t } = useTranslation();

  const { child, isLoading, pendingTasks, refetch, tasks } = useKidDashboardTasks();
  const refreshControl = usePullToRefresh({ onRefresh: refetch });

  const [activeTab, setActiveTab] = useState<TabValue>("list");

  const tabs: TabItem<TabValue>[] = [
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
        refreshing={refreshControl.refreshing}
        onRefresh={refreshControl.onRefresh}
      >
        {isLoading ? (
          <ChildHomeScreenSkeleton />
        ) : (
          <>
            <XpCard
              levelProgress={child?.levelProgress}
              xpCurrentLevel={child?.xpCurrentLevel}
              xpNextLevel={child?.xpNextLevel}
              coins={child?.coinBalance}
            />

            <View style={styles.wrapper}>
              <View style={styles.questContent}>
                <ThemedText child style={styles.questTitle}>
                  {t("kid.home.activeQuests")}
                </ThemedText>
                <Badge
                  icon={Icons.assignment}
                  text={String(pendingTasks?.length)}
                  color={Palette.orange}
                />
              </View>
              <ToggleBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              {activeTab === "list" ? <QuestList tasks={tasks} /> : <QuestMap tasks={tasks} />}
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
    color: Palette.white,
  },
  questContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
