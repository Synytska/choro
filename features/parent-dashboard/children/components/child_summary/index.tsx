/**
 * Child detail screen content for the parent dashboard.
 *
 * Props:
 * - data: child details loaded by useChildDetails, including child, tasks, and rewards.
 * - isLoading: shows the loading state while the details request is in progress.
 * Opens the edit child modal with the current child id.
 */
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useDashboardTaskFilter } from "@/features/parent-dashboard/tasks/hooks/useDashboardTaskFilter";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import {
  buttonVariant,
  dashboardTaskFilter,
  rewardStatus,
  role,
  taskStatus,
} from "@/lib/constants";
import { ChildDetailsData } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { ProgressRing } from "../../../home/components/ProgressRing";
import { StatsCard } from "../../../home/components/StatsCard";
import { useDeleteChild } from "../../hooks/useDeleteChild";
import { CustomSubtitle } from "../CustomSubtitle";
import { ChildDetailsSkeleton } from "./ChildDetailsSkeleton";
import { TodaysTaskCard } from "./TodaysTaskCard";

const childSummaryTaskTitleKeys = {
  [dashboardTaskFilter.today]: "parent.children.todaysTasks",
};

export function ChildSummaryScreen({
  data,
  isLoading,
}: {
  data?: ChildDetailsData | null;
  isLoading: boolean;
}) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const deleteChild = useDeleteChild();

  const activeTasks = data?.tasks ?? [];
  const requestedReward = data?.rewards.find((reward) => reward.status === rewardStatus.requested);

  const {
    counts: taskCounts,
    selectedFilter: taskFilter,
    setSelectedFilter: setTaskFilter,
    titleKey,
    visibleTasks,
  } = useDashboardTaskFilter(activeTasks, childSummaryTaskTitleKeys);

  const dynamicStyles = StyleSheet.create({
    giftCard: {
      backgroundColor: colors.orange,
    },
    deleteText: {
      color: colors.error,
    },
    seeAll: {
      color: colors.blue,
    },
  });

  const handleBack = () => {
    router.back();
  };

  const onSeeAllPress = () => {
    router.push("/(role-parent)/tasks");
  };

  const onEditChildPress = () => {
    router.push({
      pathname: "/edit-child-modal",
      params: { id: data?.child.id },
    });
  };

  const onTaskPress = (taskId: string) => {
    if (!data?.child.id) return;

    router.push({
      pathname: "/approve-task-modal",
      params: { childId: data.child.id, taskId },
    });
  };

  const onGiveGiftPress = () => {
    if (!data?.child.id || !requestedReward?.id) return;

    router.push({
      pathname: "/give-gift-modal",
      params: {
        childId: data.child.id,
        rewardId: requestedReward.id,
      },
    });
  };

  const getTaskPressHandler = (taskId?: string, status?: string) => {
    if (!taskId || status !== taskStatus.review) return undefined;

    return () => onTaskPress(taskId);
  };

  //TODO: make a hook
  const onDeleteChildPress = () => {
    if (!data) return;

    Alert.alert(
      t("parent.children.deleteAccountConfirmTitle", { name: data?.child.name }),
      t("parent.children.deleteAccountConfirmMessage", { name: data?.child.name }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteChild.mutate({ childId: data.child.id }),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <PageView screen={role.parent}>
        <CustomScrollView contentContainerStyle={styles.scrollView}>
          <ChildDetailsSkeleton />
        </CustomScrollView>
      </PageView>
    );
  }

  if (!data) {
    return (
      <PageView screen={role.parent}>
        <Text>Child not found</Text>
      </PageView>
    );
  }

  return (
    <PageView screen={role.parent}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <IconButton onPress={handleBack} icon={Icons.chevronLeft} size={40} round />
        <ThemedText style={styles.header}>{data.child.name}</ThemedText>
        <IconButton onPress={onEditChildPress} round icon={Icons.pencil} iconSize={18} size={40} />
      </View>

      {/* Content */}
      <CustomScrollView contentContainerStyle={styles.scrollView}>
        <ReusableCard
          key={data.child.id}
          title={data.child.name}
          image={getChildAvatarImage(data.child.avatarId, data.child.avatarUrl)}
          customSubtitle={<CustomSubtitle age={data.child.age} coins={data.child.coins} />}
        />

        <StatsCard
          totalAmount={taskCounts.total}
          pendingAmount={taskCounts.pending}
          doneAmount={taskCounts.done}
          reviewAmount={taskCounts.review}
          selectedFilter={taskFilter}
          onFilterPress={setTaskFilter}
        />

        {/* Progress card */}
        <ThemedView style={[styles.progressCard, globalStyles.shadow]}>
          <ThemedText style={styles.title}>{t("parent.children.taskProgress")}</ThemedText>
          <View style={styles.progressWrapper}>
            <ProgressRing
              ringSize={120}
              showPercent
              showText
              ringWidth={10}
              color={colors.darkGreen}
              progress={data.child.progress}
            />
          </View>
        </ThemedView>

        {requestedReward ? (
          <View style={[styles.giftCard, dynamicStyles.giftCard]}>
            <View style={[styles.rewardImageWrapper, { backgroundColor: colors.white }]}>
              {requestedReward.imageUri ? (
                <Image
                  source={requestedReward.imageUri}
                  contentFit="cover"
                  style={styles.rewardImage}
                />
              ) : (
                <Text style={styles.giftEmoji}>{requestedReward?.icon ?? "🎁"}</Text>
              )}
            </View>

            <View style={styles.giftTextWrapper}>
              <ThemedText style={styles.title}>{t("parent.children.giftTitle")}</ThemedText>
              <ThemedText style={styles.giftDescript}>
                {t("parent.children.giftDescription", {
                  name: data.child.name,
                  reward: requestedReward.name,
                })}
              </ThemedText>
              <Button variant={buttonVariant.thirdly} onPress={onGiveGiftPress}>
                {t("parent.children.giftButton")}
              </Button>
            </View>
          </View>
        ) : null}

        {/* Today's Tasks */}
        <View style={[styles.tasksWrapper]}>
          <View style={styles.tasksHeader}>
            <ThemedText style={styles.tasksTitle}>{t(titleKey)}</ThemedText>
            <TouchableOpacity onPress={onSeeAllPress}>
              <ThemedText style={[styles.seeAll, dynamicStyles.seeAll]}>
                {t("parent.home.seeAll")}
              </ThemedText>
            </TouchableOpacity>
          </View>
          {visibleTasks.length ? (
            visibleTasks.map((task, index) => (
              <TodaysTaskCard
                key={`${task.title}-${index}`}
                task={task}
                onPress={getTaskPressHandler(task.id, task.status)}
              />
            ))
          ) : (
            <ThemedText type="subtitle">{t("common.empty.noTasksYet")}</ThemedText>
          )}
        </View>
        <TouchableOpacity onPress={onDeleteChildPress} style={styles.deleteWrapper}>
          <ThemedText style={[styles.deleteText, dynamicStyles.deleteText]}>
            {t("parent.children.deleteChildren")}
          </ThemedText>
        </TouchableOpacity>
      </CustomScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 18,
    fontWeight: 700,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
  },
  scrollView: {
    gap: 24,
    paddingTop: 24,
    flexGrow: 1,
  },
  progressCard: {
    padding: 24,
    borderRadius: 24,
    gap: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressWrapper: {
    alignItems: "center",
  },
  giftEmoji: {
    fontSize: 24,
  },
  giftCard: {
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },
  giftDescript: {
    fontSize: 14,
    width: "80%",
    paddingBottom: 10,
  },
  giftTextWrapper: {
    flexWrap: "wrap",
  },
  tasksWrapper: {
    gap: 10,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  tasksHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "800",
  },
  deleteWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 500,
    alignSelf: "center",
  },
  rewardImage: {
    width: "100%",
    height: "100%",
  },
  rewardImageWrapper: {
    height: 48,
    width: 48,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
