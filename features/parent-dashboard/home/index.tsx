import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { Header } from "@/components/ui/Header";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useChildren } from "@/features/parent-dashboard/children/hooks/useChildren";
import { useAppColors } from "@/hooks/use-app-colors";
import { dashboardTaskFilter, taskStatus } from "@/lib/constants";
import { DashboardTaskFilter } from "@/lib/types";
import { getInitials } from "@/lib/utils/utils";

import { ChildShortSummaryCard } from "./components/ChildShortSummaryCard";
import { ParentDashboardSkeleton } from "./components/ParentDashboardSkeleton";
import { StatsCard } from "./components/StatsCard";
import { StatusLabel } from "./components/StatusLabel";

export default function ParentDashboardUI() {
  const colors = useAppColors();
  const { data: profile } = useProfile();
  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const { t } = useTranslation();
  const router = useRouter();

  const initials = getInitials(profile?.name || "");

  const [taskFilter, setTaskFilter] = useState<DashboardTaskFilter>(dashboardTaskFilter.today);

  const children = dashboardData?.children ?? [];
  const activeTasks = dashboardData?.tasks ?? [];
  const pendingTasks = activeTasks.filter((task) => task.status === taskStatus.pending);
  const doneTasks = activeTasks.filter((task) => task.status === taskStatus.done);
  const reviewTasks = activeTasks.filter((task) => task.status === taskStatus.review);
  const visibleTasks = useMemo(() => {
    if (taskFilter === dashboardTaskFilter.today) {
      return activeTasks;
    }

    return activeTasks.filter((task) => task.status === taskFilter);
  }, [activeTasks, taskFilter]);

  const visibleText = () => {
    switch (taskFilter) {
      case dashboardTaskFilter.today:
        return t("parent.home.activeTasks");
      case dashboardTaskFilter.done:
        return t("parent.home.doneTasks");
      case dashboardTaskFilter.pending:
        return t("parent.home.pendingTasks");
      case dashboardTaskFilter.review:
        return t("parent.home.reviewTasks");
      default:
        return t("parent.home.activeTasks");
    }
  };

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

  const onSeeAllPress = () => {
    router.push("/(role-parent)/tasks");
  };

  const onChildPress = (id: string) => {
    router.push({
      pathname: "/(role-parent)/children/[id]",
      params: { id },
    });
  };

  if (isChildrenLoading && !dashboardData) {
    return (
      <PageView background="parent">
        <CustomScrollView contentContainerStyle={styles.scrollWrapper}>
          <ParentDashboardSkeleton />
        </CustomScrollView>
      </PageView>
    );
  }

  return (
    <PageView background="parent">
      {/* Header */}
      <Header
        title={t("parent.home.greeting", { name: profile?.name ?? t("common.user") })}
        subtitle={t("parent.home.subtitle", { amount: pendingTasks.length })}
        icon={
          <>
            {profile?.avatar_url ? (
              <Image
                source={profile?.avatar_url ?? ChoroImages.kidAvatar}
                contentFit="cover"
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarWrapper, { backgroundColor: colors.middleGrey }]}>
                <ThemedText>{initials}</ThemedText>
              </View>
            )}
          </>
        }
      />

      <CustomScrollView contentContainerStyle={styles.scrollWrapper}>
        {/* Children */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionEyebrow, dynamicStyles.sectionEyebrow]}>
            {t("common.children")}
          </ThemedText>
          <View style={styles.childrenGrid}>
            {children.length ? (
              children.map((child) => (
                <ChildShortSummaryCard
                  onPress={() => onChildPress(child.id)}
                  key={child.name}
                  child={child}
                  style={cardStyle}
                />
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
          reviewAmount={reviewTasks.length}
          selectedFilter={taskFilter}
          onFilterPress={setTaskFilter}
        />

        {/* Tasks */}
        <View style={styles.activeTaskWrapper}>
          <View style={styles.tasksHeader}>
            <ThemedText style={styles.sectionTitle}>{visibleText()}</ThemedText>
            <TouchableOpacity onPress={onSeeAllPress}>
              <ThemedText style={styles.seeAll}>{t("parent.home.seeAll")}</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.tasksList}>
            {visibleTasks.length ? (
              visibleTasks.map((task, index) => (
                <ReusableCard
                  key={`${task.title}-${index}`}
                  title={task.title}
                  image={ChoroImages.kidAvatar}
                  subtitle={task.time}
                  aditionalContent={<StatusLabel status={task.status} />}
                />
              ))
            ) : (
              <ThemedText type="subtitle">
                {isChildrenLoading ? "Loading..." : "No tasks yet."}
              </ThemedText>
            )}
          </View>
        </View>
      </CustomScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    gap: 32,
    marginTop: 32,
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
  activeTaskWrapper: {
    gap: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 50,
  },
  avatarWrapper: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});
