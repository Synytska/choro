import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { Fonts } from "@/constants/theme";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useChildren } from "@/features/parent-dashboard/children/hooks/useChildren";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { addButtonSize } from "@/lib/constants";

import { ChildShortSummaryCard } from "./components/ChildShortSummaryCard";
import { StatsCard } from "./components/StatsCard";
import { TaskCard } from "./components/TaskCard";

export default function ParentDashboardUI() {
  const colors = useAppColors();
  const { data: profile } = useProfile();
  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const { t } = useTranslation();
  const router = useRouter();

  const children = dashboardData?.children ?? [];
  const activeTasks = dashboardData?.tasks ?? [];
  const pendingTasks = activeTasks.filter((task) => task.status === "pending");
  const doneTasks = activeTasks.filter((task) => task.status === "done");

  const cardStyle = children.length === 2 ? styles.cardFlexible : styles.cardThreePerRow;

  const dynamicStyles = StyleSheet.create({
    settingsButton: {
      backgroundColor: colors.white,
      borderColor: colors.darkNavy,
    },
    sectionEyebrow: {
      color: colors.darkGrey,
    },
  });

  const onSettingsPress = () => {
    router.push("/(role-parent)/settings");
  };

  const onSeeAllPress = () => {
    router.push("/(role-parent)/tasks");
  };

  return (
    <PageView background="parent">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <LogoSmall />
          <View style={styles.headerWrapper}>
            <ThemedText style={styles.greeting}>
              {t("p-dashboard.home.greeting", { name: profile?.name ?? t("common.user") })} 👋
            </ThemedText>
            <ThemedText type="subtitle">
              {t("p-dashboard.home.subtitle", { amount: pendingTasks.length })}
            </ThemedText>
          </View>
        </View>

        <IconButton onPress={onSettingsPress} icon={Icons.settings} iconSize={32} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollWrapper}>
        {/* Children */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
            {t("common.children")}
          </ThemedText>
          <View style={styles.childrenGrid}>
            {children.length ? (
              children.map((child) => (
                <ChildShortSummaryCard key={child.name} child={child} style={cardStyle} />
              ))
            ) : (
              <ThemedText type="subtitle">
                {isChildrenLoading ? "Loading..." : "No children yet."}
              </ThemedText>
            )}
          </View>
        </View>

        <StatsCard
          totalAmount={activeTasks.length}
          pendingAmount={pendingTasks.length}
          doneAmount={doneTasks.length}
        />

        {/* Tasks */}
        <View style={styles.activeTaskWrapper}>
          <View style={styles.tasksHeader}>
            <ThemedText style={styles.sectionTitle}>{t("p-dashboard.home.activeTasks")}</ThemedText>
            <TouchableOpacity onPress={onSeeAllPress}>
              <ThemedText style={styles.seeAll}>{t("p-dashboard.home.seeAll")}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.tasksList}>
            {activeTasks.length ? (
              activeTasks.map((task, index) => (
                <TaskCard key={`${task.title}-${index}`} task={task} index={index} />
              ))
            ) : (
              <ThemedText type="subtitle">
                {isChildrenLoading ? "Loading..." : "No tasks yet."}
              </ThemedText>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.addButton, globalStyles.shadow]}>
        <IconButton
          onPress={onSettingsPress}
          backgroundColor={colors.orange}
          borderColor={colors.white}
          size={addButtonSize}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    gap: 32,
    marginTop: 32,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  headerWrapper: {
    gap: 4,
  },
  greeting: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
  },
  section: {
    gap: 16,
  },
  sectionEyebrow: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  childrenGrid: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  cardFlexible: {
    flex: 1,
  },
  cardThreePerRow: {
    flexBasis: "31%",
    maxWidth: "31%",
  },
  tasksHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "800",
    color: "#5146E8",
  },
  tasksList: {
    gap: 12,
  },

  addButton: {
    position: "absolute",
    right: 20,
    bottom: 2,
  },
  activeTaskWrapper: {
    gap: 16,
  },
});
