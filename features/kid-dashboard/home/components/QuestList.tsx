import { useRouter, useSegments } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { taskStatus } from "@/lib/constants";
import { getDefaultTaskTitle } from "@/lib/defaultTasks";
import type { TaskItem } from "@/lib/types";

import { sortKidTasksByStatus } from "../utils/taskSorting";
import { IconLabel } from "./IconLabel";

export function QuestList({ tasks }: { tasks: TaskItem[] }) {
  const sortedTasks = useMemo(() => sortKidTasksByStatus(tasks), [tasks]);

  return (
    <CustomScrollView nestedScrollEnabled={true} contentContainerStyle={styles.tasksList}>
      {sortedTasks.map((task, index) => (
        <QuestListItem key={task.id ?? `${task.title}-${index}`} task={task} />
      ))}
    </CustomScrollView>
  );
}

function QuestListItem({ task }: { task: TaskItem }) {
  const router = useRouter();
  const segments = useSegments();
  const { t } = useTranslation();
  const title = getDefaultTaskTitle(task, t);

  const taskDone = task.status === taskStatus.done;
  const taskInReview = task.status === taskStatus.review;

  const canOpenTask = Boolean(task.id) && !taskDone && !taskInReview;
  const accent = taskDone ? Palette.green : Palette.orange;

  const reviewTheme = {
    accent: Palette.orange,
    bg: Palette.review,
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: accent,
      backgroundColor: Palette.darkNavy,
      shadowColor: accent,
    },
    accent: {
      backgroundColor: accent,
    },
    checkboxColor: {
      borderColor: accent,
    },
    review: {
      opacity: 0.7,
    },
  });

  const onTaskPress = () => {
    if (!task.id) {
      return;
    }

    const routeSegments = segments as string[];
    const confirmTaskPath = routeSegments.includes("(tasks)")
      ? "/(role-kid)/(tasks)/confirm-task"
      : "/(role-kid)/(home)/confirm-task";

    router.push({
      pathname: confirmTaskPath,
      params: { id: task.id, color: accent },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onTaskPress}
      disabled={!canOpenTask}
      style={[
        styles.container,
        dynamicStyles.container,
        globalStyles.kidShadow,
        taskInReview && dynamicStyles.review,
      ]}
    >
      <View style={styles.wrapper}>
        <View style={[styles.line, dynamicStyles.accent]} />
        <View style={[styles.iconContainer, dynamicStyles.accent]}>
          <Text style={{ fontSize: 16 }}>{task.emoji}</Text>
        </View>
        <View style={styles.titleWrapper}>
          <ThemedText mono style={[styles.title, taskDone && styles.titleDone]}>
            {title}
          </ThemedText>
          <View style={styles.coinsWrapper}>
            <AppIcon icon={Icons.coins} size={16} color={Palette.yellow} />
            <ThemedText style={styles.coins}>+ {task.coinReward}</ThemedText>
            <ThemedText child style={styles.category}>
              /{task.category}
            </ThemedText>
          </View>
        </View>
      </View>

      {taskDone ? (
        <IconLabel
          size={34}
          icon={<AppIcon icon={Icons.check} size={16} color={Palette.black} />}
          backgroundColor={Palette.green}
        />
      ) : (
        <View style={[styles.checkboxWrapper, dynamicStyles.checkboxColor]}>
          <View style={[styles.checkbox, dynamicStyles.checkboxColor]} />
        </View>
      )}

      {taskInReview && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.absoluteContainer,
            { backgroundColor: reviewTheme.bg },
          ]}
        >
          <ThemedText child style={[styles.absoluteText, { color: reviewTheme.accent }]}>
            {t("kid.home.inReview")}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tasksList: {
    gap: 12,
    flexGrow: 1,
  },
  container: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  absoluteContainer: {
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  absoluteText: {
    fontSize: 26,
    transform: [{ rotate: "20deg" }],
  },
  wrapper: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  line: {
    width: 6,
    height: 44,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapper: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
    lineHeight: 17,
    color: Palette.white,
  },
  titleDone: {
    textDecorationLine: "line-through",
  },
  coinsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coins: {
    fontSize: 12,
    fontWeight: "800",
    color: Palette.yellow,
  },
  checkboxWrapper: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 12,
  },
  category: {
    color: Palette.darkGrey,
    textTransform: "capitalize",
  },
});
