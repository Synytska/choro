import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import GridOverlay from "@/components/ui/GridOverlay";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { fullScreenWidth, taskStatus } from "@/lib/constants";
import type { TaskItem } from "@/lib/types";

import { chunkTasks, sortKidTasksByStatus } from "../utils/taskSorting";

export function QuestMap({ tasks }: { tasks: TaskItem[] }) {
  const sortedTaskGroups = useMemo(() => chunkTasks(sortKidTasksByStatus(tasks), 3), [tasks]);

  if (!tasks.length) {
    //TODO: Localize
    return <ThemedText type="subtitle">No tasks yet</ThemedText>;
  }

  return (
    <ThemedView child style={styles.map}>
      <GridOverlay width={fullScreenWidth} />

      <CustomScrollView nestedScrollEnabled contentContainerStyle={styles.mapContent}>
        {sortedTaskGroups.map((group, groupIndex) => (
          <View key={`quest-map-group-${groupIndex}`} style={styles.group}>
            <View style={styles.topRow}>
              {group[0] ? <QuestMapItem task={group[0]} /> : <View style={styles.placeholder} />}
              {group[1] ? <QuestMapItem task={group[1]} /> : <View style={styles.placeholder} />}
            </View>

            {group[2] ? (
              <View style={styles.centerRow}>
                <QuestMapItem task={group[2]} />
              </View>
            ) : null}
          </View>
        ))}
      </CustomScrollView>
    </ThemedView>
  );
}

function QuestMapItem({ task }: { task: TaskItem }) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const taskDone = task.status === taskStatus.done;
  const taskInReview = task.status === taskStatus.review;
  const canOpenTask = Boolean(task.id) && !taskDone && !taskInReview;
  const accent = taskDone ? colors.green : colors.orange;
  const showBadge = taskDone || taskInReview;

  const dynamicStyles = StyleSheet.create({
    card: {
      borderColor: accent,
      shadowColor: accent,
      backgroundColor: colors.darkNavy,
    },
    badge: {
      backgroundColor: accent,
      shadowColor: accent,
    },
    title: {
      color: colors.white,
    },
    review: {
      opacity: 0.7,
    },
  });

  const onTaskPress = () => {
    if (!task.id) return;

    router.push({
      pathname: "/(role-kid)/(home)/confirm-task",
      params: { id: task.id, color: accent },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!canOpenTask}
      onPress={onTaskPress}
      style={styles.item}
    >
      <View
        style={[
          styles.card,
          dynamicStyles.card,
          globalStyles.kidShadow,
          taskInReview && dynamicStyles.review,
        ]}
      >
        <Text style={styles.emoji}>{task.emoji}</Text>

        {showBadge && (
          <View style={[styles.badge, dynamicStyles.badge, globalStyles.kidShadow]}>
            <AppIcon
              icon={taskDone ? Icons.check : Icons.exclamation}
              size={14}
              color={colors.black}
            />
          </View>
        )}
      </View>

      <View style={styles.titleWrapper}>
        <ThemedText mono numberOfLines={1} style={[styles.title, dynamicStyles.title]}>
          {taskInReview ? t("kid.home.inReview") : task.title}
        </ThemedText>

        <View style={styles.coinsWrapper}>
          <AppIcon icon={Icons.coins} size={14} color={colors.yellow} />
          <ThemedText child style={[styles.coinsText, dynamicStyles.title]}>
            +{task.coinReward}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  map: {
    maxHeight: 527,
    overflow: "hidden",
  },
  mapContent: {
    paddingHorizontal: 28,
    paddingVertical: 22,
  },
  group: {
    gap: 48,
    paddingBottom: 48,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  centerRow: {
    alignItems: "center",
  },
  item: {
    width: 112,
    alignItems: "center",
    gap: 8,
  },
  placeholder: {
    width: 112,
  },
  card: {
    width: 64,
    height: 64,
    borderWidth: 3,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 30,
  },
  badge: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    gap: 4,
  },
  title: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: 800,
    textAlign: "center",
    textTransform: "uppercase",
  },
  coinsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
  },
  coinsText: {
    lineHeight: 17,
  },
});
