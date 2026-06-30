import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppColors } from "@/hooks/use-app-colors";
import { TaskItem } from "@/lib/types";

export function TaskCard({ task, index }: { task: TaskItem; index: number }) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const isDone = task.status === "done";

  //TODO: Replace it
  const avatarBackgrounds = ["#E8DDD0", "#F6D6C8", "#DCEAF4"];

  const dynamicStyles = StyleSheet.create({
    taskCard: {
      backgroundColor: colors.background,
      shadowColor: colors.darkNavy,
    },
    taskTime: {
      color: colors.darkGrey,
    },
    doneBadge: {
      backgroundColor: colors.lightGreen,
    },
    pendingBadge: {
      backgroundColor: colors.lightYellow,
    },
    doneBadgeText: {
      color: colors.darkGreen,
    },
    pendingBadgeText: {
      color: colors.orange,
    },
  });

  const statusStyles = isDone ? dynamicStyles.doneBadge : dynamicStyles.pendingBadge;
  const statusTextStyles = isDone ? dynamicStyles.doneBadgeText : dynamicStyles.pendingBadgeText;

  return (
    <ThemedView style={[styles.taskCard, dynamicStyles.taskCard]}>
      <View style={styles.taskLeft}>
        <View style={[styles.avatar, { backgroundColor: avatarBackgrounds[index] }]}>
          <Image source={ChoroImages.kidAvatar} style={styles.avatarImage} contentFit="cover" />
        </View>
        <View style={styles.taskCopy}>
          <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
          <ThemedText style={[styles.taskTime, dynamicStyles.taskTime]}>{task.time}</ThemedText>
        </View>
      </View>

      <View style={[styles.statusBadge, statusStyles]}>
        <ThemedText style={[styles.statusText, statusTextStyles]}>
          {isDone ? t("common.done") : t("common.pending")}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
    elevation: 2,
  },
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  taskCopy: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  taskTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
