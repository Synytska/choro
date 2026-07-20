import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useAppColors } from "@/hooks/use-app-colors";
import { fullScreenWidth, role, taskStatus } from "@/lib/constants";
import { TabItem, TabValue } from "@/lib/types";

import { Badge } from "./components/Badge";
import { CoinStash } from "./components/CoinStash";
import { KidHeader } from "./components/KidHeader";
import { QuestList } from "./components/QuestList";
import { ToggleBar } from "./components/ToggleBar";
import { XpCard } from "./components/XpCard";
import { useKidDashboard } from "./hooks/useKidDashboard";

export default function ChildrenDashboardUI() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const { data: dashboardData } = useKidDashboard();
  const child = dashboardData?.child;
  const tasks = dashboardData?.tasks;
  const pendingTasks = tasks?.filter((task) => task.status === taskStatus.pending);
  const doneTasks = tasks?.filter((task) => task.status === taskStatus.done);

  const [activeTab, setActiveTab] = useState<TabValue>("list");
  const [headerHeight, setHeaderHeight] = useState(0);

  const tabs: TabItem[] = [
    //Localize
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
    <PageView screen={role.kid}>
      <StatusBar barStyle="light-content" />

      <KidHeader
        child={child}
        setHeaderHeight={setHeaderHeight}
        questLength={pendingTasks?.length}
      />

      <CustomScrollView
        style={[styles.scrollView, { marginTop: headerHeight }]}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <XpCard
          doneTasks={doneTasks?.length}
          allTasks={tasks?.length}
          levelProgress={child?.levelProgress}
          xpCurrentLevel={child?.xpCurrentLevel}
          xpNextLevel={child?.xpNextLevel}
        />

        <View style={styles.wrapper}>
          <View style={styles.questContent}>
            <ThemedText mono style={[styles.questTitle, { color: colors.white }]}>
              {t("kid.home.activeQuests")}
            </ThemedText>
            <Badge
              icon={Icons.assignment}
              text={String(pendingTasks?.length)}
              iconColor={colors.orange}
              style={[styles.badge, { borderColor: colors.orange }]}
            />
          </View>
          <ToggleBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <QuestList tasks={tasks ?? []} />
        </View>

        <CoinStash coinBalance={child?.coinBalance ?? child?.coins} xpTotal={child?.xpTotal} />
      </CustomScrollView>

      <GridOverlay width={fullScreenWidth} withStars />
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 100,
  },
  scrollViewContainer: {
    gap: 16,
  },
  wrapper: {
    gap: 12,
  },
  badge: {
    borderWidth: 2,
    borderRadius: 50,
  },
  questTitle: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  questContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
