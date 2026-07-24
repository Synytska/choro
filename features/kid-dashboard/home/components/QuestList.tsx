import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";
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
  const colors = useAppColors();
  const { t } = useTranslation();

  const taskDone = task.status === taskStatus.done;
  const taskInReview = task.status === taskStatus.review;

  const canOpenTask = Boolean(task.id) && !taskDone && !taskInReview;
  const accent = taskDone ? colors.green : colors.orange;

  const reviewTheme = {
    accent: colors.orange,
    bg: colors.review,
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: accent,
      backgroundColor: colors.darkNavy,
      shadowColor: accent,
    },
    accent: {
      backgroundColor: accent,
    },
    title: {
      color: colors.white,
    },
    coins: {
      color: colors.yellow,
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

    router.push({
      pathname: "/(role-kid)/(home)/confirm-task",
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
          <ThemedText
            mono
            style={[styles.title, dynamicStyles.title, taskDone && styles.titleDone]}
          >
            {task.title}
          </ThemedText>
          <View style={styles.coinsWrapper}>
            <AppIcon icon={Icons.coins} size={16} color={colors.yellow} />
            <ThemedText style={[styles.coins, dynamicStyles.coins]}>+ {task.coinReward}</ThemedText>
          </View>
        </View>
      </View>

      {taskDone ? (
        <IconLabel
          size={34}
          icon={<AppIcon icon={Icons.check} size={16} color={colors.black} />}
          backgroundColor={colors.green}
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
    gap: 16,
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
});
