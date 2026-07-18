import { useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useAppColors } from "@/hooks/use-app-colors";
import { fullScreenWidth, role } from "@/lib/constants";
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

  const { data: dashboardData } = useKidDashboard();
  const child = dashboardData?.child;
  const tasks = dashboardData?.tasks;

  const [activeTab, setActiveTab] = useState<TabValue>("list");

  const tabs: TabItem[] = [
    //Localize
    {
      icon: Icons.menu,
      title: "List",
      value: "list",
    },
    {
      icon: Icons.map,
      title: "Map",
      value: "map",
    },
  ];

  return (
    <PageView screen={role.kid}>
      <StatusBar barStyle="light-content" />

      <KidHeader child={child} />
      <CustomScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <XpCard />

        <View style={styles.wrapper}>
          <View style={styles.questContent}>
            <ThemedText mono style={[styles.questTitle, { color: colors.white }]}>
              Active Quests
            </ThemedText>
            <Badge
              icon={Icons.assignment}
              //TODO: Show only undone length
              text={String(tasks?.length)}
              iconColor={colors.orange}
              style={[styles.badge, { borderColor: colors.orange }]}
            />
          </View>
          <ToggleBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          {/* Task list with all tasks */}
          {tasks &&
            tasks.map((task, index) => <QuestList key={task.id} task={task} index={index} />)}
        </View>

        <CoinStash />
      </CustomScrollView>

      <GridOverlay width={fullScreenWidth} withStars />
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 100,
    marginTop: 16,
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
