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
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildDetailsData } from "@/lib/types";

import { ProgressRing } from "../../../home/components/ProgressRing";
import { StatsCard } from "../../../home/components/StatsCard";
import { ChildCard } from "../ChildCard";
import { TodaysTaskCard } from "./TodaysTaskCard";

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

  const activeTasks = data?.tasks ?? [];
  const pendingTasks = activeTasks.filter((task) => task.status === "pending");
  const doneTasks = activeTasks.filter((task) => task.status === "done");

  const dynamicStyles = StyleSheet.create({
    giftCard: {
      backgroundColor: colors.orange,
    },
    backButton: {
      backgroundColor: colors.white,
      borderColor: colors.middleGrey,
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

  if (isLoading) {
    return (
      <PageView background="parent">
        <Text>Loading...</Text>
      </PageView>
    );
  }

  if (!data) {
    return (
      <PageView background="parent">
        <Text>Child not found</Text>
      </PageView>
    );
  }

  return (
    <PageView background="parent">
      {/* Header */}
      <View style={styles.headerWrapper}>
        <IconButton onPress={handleBack} icon={Icons.chevronLeft} size={40} />
        <ThemedText style={styles.header}>{data.child.name}</ThemedText>
        <IconButton onPress={onEditChildPress} icon={Icons.pencil} iconSize={26} size={40} />
      </View>

      {/* Content */}
      <CustomScrollView contentContainerStyle={styles.scrollView}>
        <ChildCard name={data.child.name} age={data.child.age} coins={data.child.coins} />

        <StatsCard
          totalAmount={activeTasks.length}
          pendingAmount={pendingTasks.length}
          doneAmount={doneTasks.length}
        />

        {/* Progress card */}
        <ThemedView style={[styles.progressCard, globalStyles.shadow]}>
          <ThemedText style={styles.title}>{t("p-dashboard.children.taskProgress")}</ThemedText>
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
        <View style={[styles.giftCard, dynamicStyles.giftCard]}>
          <ThemedView style={styles.giftWrapper}>
            <Text style={styles.giftEmoji}>🎁</Text>
          </ThemedView>

          <View style={styles.giftTextWrapper}>
            <ThemedText style={styles.title}>{t("p-dashboard.children.giftTitle")}</ThemedText>
            <ThemedText style={styles.giftDescript}>
              {t("p-dashboard.children.giftDescription", { name: data.child.name })}
            </ThemedText>
            {/* TODO: implement give gift logic */}
            <Button variant="thirdly" onPress={() => {}}>
              {t("p-dashboard.children.giftButton")}
            </Button>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={[styles.tasksWrapper]}>
          <View style={styles.tasksHeader}>
            <ThemedText style={styles.tasksTitle}>
              {t("p-dashboard.children.todaysTasks")}
            </ThemedText>
            <TouchableOpacity onPress={onSeeAllPress}>
              <ThemedText style={styles.seeAll}>{t("p-dashboard.home.seeAll")}</ThemedText>
            </TouchableOpacity>
          </View>
          {activeTasks.map((task, index) => (
            <TodaysTaskCard key={`${task.title}-${index}`} task={task} />
          ))}
        </View>
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
    color: "#5146E8",
  },
});
