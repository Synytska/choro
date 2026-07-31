import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { Header } from "@/components/ui/Header";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ParentDashboardSkeleton } from "@/components/ui/skeletons/parents/ParentDashboardSkeleton";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useChildren } from "@/features/parent-dashboard/children/hooks/useChildren";
import { useDashboardTaskFilter } from "@/features/parent-dashboard/tasks/hooks/useDashboardTaskFilter";
import { useAppColors } from "@/hooks/use-app-colors";
import { rewardStatus, role, scrollViewTop, taskStatus } from "@/lib/constants";
import { getChildAvatarImage, getInitials } from "@/lib/utils/utils";

import { ChildShortSummaryCard } from "./components/ChildShortSummaryCard";
import { StatsCard } from "./components/StatsCard";
import { StatusLabel } from "./components/StatusLabel";

export default function ParentDashboardUI() {
  const colors = useAppColors();
  const { data: profile } = useProfile();
  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const { t } = useTranslation();
  const router = useRouter();

  const initials = getInitials(profile?.name || "");

  const children = useMemo(() => dashboardData?.children ?? [], [dashboardData?.children]);
  const activeTasks = useMemo(() => dashboardData?.tasks ?? [], [dashboardData?.tasks]);
  const {
    counts: taskCounts,
    selectedFilter: taskFilter,
    setSelectedFilter: setTaskFilter,
    titleKey,
    visibleTasks,
  } = useDashboardTaskFilter(activeTasks);
  const childById = useMemo(() => new Map(children.map((child) => [child.id, child])), [children]);
  const badgesByChildId = useMemo(() => {
    const taskBadges = (dashboardData?.tasks ?? []).reduce<Record<string, number>>((acc, task) => {
      if (!task.childId || task.status !== taskStatus.review) return acc;

      acc[task.childId] = (acc[task.childId] ?? 0) + 1;

      return acc;
    }, {});

    return (dashboardData?.rewards ?? []).reduce<Record<string, number>>((acc, reward) => {
      if (reward.status !== rewardStatus.requested) return acc;

      acc[reward.childId] = (acc[reward.childId] ?? 0) + 1;

      return acc;
    }, taskBadges);
  }, [dashboardData?.rewards, dashboardData?.tasks]);

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

  const onTaskPress = (childId: string, taskId: string) => {
    router.push({
      pathname: "/approve-task-modal",
      params: { childId, taskId },
    });
  };

  const getTaskPressHandler = (childId?: string, taskId?: string, status?: string) => {
    if (!childId || !taskId || status !== taskStatus.review) return undefined;

    return () => onTaskPress(childId, taskId);
  };

  if (isChildrenLoading && !dashboardData) {
    return (
      <PageView screen={role.parent}>
        <CustomScrollView contentContainerStyle={styles.scrollWrapper}>
          <ParentDashboardSkeleton />
        </CustomScrollView>
      </PageView>
    );
  }

  return (
    <PageView screen={role.parent}>
      {/* Header */}
      <Header
        title={t("parent.home.greeting", { name: profile?.name ?? t("common.user") })}
        subtitle={t("parent.home.subtitle", { amount: taskCounts.pending })}
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
                  badgeValue={badgesByChildId[child.id]}
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
          totalAmount={taskCounts.total}
          pendingAmount={taskCounts.pending}
          doneAmount={taskCounts.done}
          reviewAmount={taskCounts.review}
          selectedFilter={taskFilter}
          onFilterPress={setTaskFilter}
        />

        {/* Tasks */}
        <View style={styles.activeTaskWrapper}>
          <View style={styles.tasksHeader}>
            <ThemedText style={styles.sectionTitle}>{t(titleKey)}</ThemedText>
            <TouchableOpacity onPress={onSeeAllPress}>
              <ThemedText style={styles.seeAll}>{t("parent.home.seeAll")}</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.tasksList}>
            {visibleTasks.length ? (
              visibleTasks.map((task, index) => {
                const child = task.childId ? childById.get(task.childId) : undefined;
                const avatarUri = getChildAvatarImage(child?.avatarId, child?.avatarUrl);

                return (
                  <ReusableCard
                    key={`${task.title}-${index}`}
                    title={task.title}
                    image={avatarUri}
                    subtitle={child?.name}
                    aditionalContent={<StatusLabel status={task.status} />}
                    onPress={getTaskPressHandler(task.childId, task.id, task.status)}
                  />
                );
              })
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
    marginTop: scrollViewTop,
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
