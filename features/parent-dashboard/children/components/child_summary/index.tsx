/**
 * Child detail screen content for the parent dashboard.
 *
 * Props:
 * - data: child details loaded by useChildDetails, including child, tasks, and rewards.
 * - isLoading: shows the loading state while the details request is in progress.
 * Opens the edit child modal with the current child id.
 */
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useDashboardTaskFilter } from "@/features/parent-dashboard/tasks/hooks/useDashboardTaskFilter";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { dashboardTaskFilter, screenBackground } from "@/lib/constants";
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
      <PageView screen={screenBackground.parent}>
        <CustomScrollView contentContainerStyle={styles.scrollView}>
          <ChildDetailsSkeleton />
        </CustomScrollView>
      </PageView>
    );
  }

  if (!data) {
    return (
      <PageView screen={screenBackground.parent}>
        <Text>Child not found</Text>
      </PageView>
    );
  }

  return (
    <PageView screen={screenBackground.parent}>
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
              ringWidth={10}
              color={colors.darkGreen}
              progress={data.child.progress}
            />
          </View>
        </ThemedView>

        {/* Gift Card  TODO: show only if child has earned a reward */}
        {/* <View style={[styles.giftCard, dynamicStyles.giftCard]}>
          <ThemedView style={styles.giftWrapper}>
            <Text style={styles.giftEmoji}>🎁</Text>
          </ThemedView>

          <View style={styles.giftTextWrapper}>
            <ThemedText style={styles.title}>{t("parent.children.giftTitle")}</ThemedText>
            <ThemedText style={styles.giftDescript}>
              {t("parent.children.giftDescription", { name: data.child.name })}
            </ThemedText>
            TODO: implement give gift logic
            <Button variant="thirdly" onPress={() => {}}>
              {t("parent.children.giftButton")}
            </Button>
          </View>
        </View> */}

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
              <TodaysTaskCard key={`${task.title}-${index}`} task={task} />
            ))
          ) : (
            //TODO: Localize
            <ThemedText type="subtitle">No tasks yet.</ThemedText>
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
  giftWrapper: {
    borderRadius: 50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
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
});
