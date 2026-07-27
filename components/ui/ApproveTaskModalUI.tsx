import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useUpdateTaskStatus } from "@/features/parent-dashboard/tasks/hooks/useUpdateTaskStatus";
import { useAppColors } from "@/hooks/use-app-colors";
import { role, taskStatus } from "@/lib/constants";
import { ChildCard, TaskItem } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { AppIcon, Icons } from "./AppIcon";
import PageView from "./PageView";

type ApproveTaskModalUIProps = {
  child?: ChildCard;
  task?: TaskItem;
  isLoading?: boolean;
};

export function ApproveTaskModalUI({ child, isLoading, task }: ApproveTaskModalUIProps) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const updateTaskStatus = useUpdateTaskStatus();

  const canApprove = Boolean(task?.id) && task?.status === taskStatus.review;
  const avatarUri = getChildAvatarImage(child?.avatarId, child?.avatarUrl);

  const onApprove = () => {
    if (!task?.id || updateTaskStatus.isPending) return;

    updateTaskStatus.mutate(
      {
        taskId: task.id,
        status: taskStatus.done,
      },
      {
        onSuccess: () => router.back(),
      },
    );
  };

  const onCancel = () => {
    router.back();
  };

  if (isLoading || !task) {
    return (
      <PageView modal screen={role.parent}>
        <View style={styles.centerContent}>
          <ThemedText type="subtitle">{t("common.loading")}</ThemedText>
        </View>
      </PageView>
    );
  }

  return (
    <PageView
      modal
      screen={role.parent}
      buttons={[
        {
          title: t("parent.tasks.approveTask"),
          onPress: onApprove,
          disabled: !canApprove || updateTaskStatus.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: onCancel,
          variant: "outline",
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconWrapper]}>
            <Image source={avatarUri} style={styles.avatar} />
          </View>

          <View style={styles.headerText}>
            <ThemedText style={styles.title}>{t("parent.tasks.reviewProof")}</ThemedText>
            <ThemedText type="subtitle">
              {child?.name ? t("parent.tasks.submittedBy", { name: child.name }) : task.title}
            </ThemedText>
          </View>
        </View>

        <ThemedView style={[styles.taskCard]}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleWrapper}>
              <ThemedText style={styles.emoji}>{task.emoji ?? "✅"}</ThemedText>
              <View style={styles.taskText}>
                <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
                {!!task.description && <ThemedText type="subtitle">{task.description}</ThemedText>}
              </View>
            </View>
            <View style={[styles.label, { backgroundColor: colors.lightYellow }]}>
              <ThemedText style={[styles.labelText, { color: colors.orange }]}>
                {t("common.waitingForReview")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.rewardRow}>
            <ThemedText type="subtitle">{t("parent.tasks.rewardCoins")}</ThemedText>
            <ThemedText style={[styles.rewardValue, { color: colors.orange }]}>
              +{task.coinReward ?? 1}
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.proofSection}>
          <ThemedText style={styles.sectionTitle}>{t("kid.home.photoProof")}</ThemedText>
          {task.proofPhotoUrl ? (
            <Image source={task.proofPhotoUrl} style={styles.proofImage} contentFit="cover" />
          ) : (
            <View style={[styles.emptyProof, { borderColor: colors.middleGrey }]}>
              <AppIcon icon={Icons.camera} size={28} color={colors.darkGrey} />
              <ThemedText type="subtitle">{t("parent.tasks.noProofPhoto")}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 26,
  },
  taskCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  taskTitleWrapper: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  taskText: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  proofSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  proofImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  emptyProof: {
    minHeight: 220,
    borderWidth: 1,
    borderRadius: 18,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 12,
    fontWeight: 700,
  },
});
