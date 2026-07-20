import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";
import { TaskItem } from "@/lib/types";

import { IconLabel } from "./IconLabel";

interface QuestListProps {
  tasks: TaskItem[];
}

interface QuestListItemProps {
  task: TaskItem;
  index: number;
}

export function QuestList({ tasks }: QuestListProps) {
  return (
    <>
      {tasks.map((task, index) => (
        <QuestListItem key={task.id ?? `${task.title}-${index}`} task={task} index={index} />
      ))}
    </>
  );
}

function QuestListItem({ task, index }: QuestListItemProps) {
  const router = useRouter();
  const colors = useAppColors();

  const taskDone = task.status === taskStatus.done;
  const canOpenTask = Boolean(task.id) && !taskDone;

  const questThemes = [
    {
      accent: colors.orange,
    },
    {
      accent: colors.blue,
    },
    {
      accent: colors.yellow,
    },
  ] as const;

  const completedTheme = {
    accent: colors.green,
  };

  const theme = taskDone ? completedTheme : questThemes[index % questThemes.length];

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: theme.accent,
      backgroundColor: colors.darkNavy,
      shadowColor: theme.accent,
    },
    line: {
      backgroundColor: theme.accent,
    },
    iconContainer: {
      backgroundColor: theme.accent,
    },
    title: {
      color: colors.white,
    },
    coins: {
      color: colors.yellow,
    },
    checkboxColor: {
      borderColor: theme.accent,
    },
  });

  const onTaskPress = () => {
    if (!task.id) {
      return;
    }

    router.push({
      pathname: "/(role-kid)/(home)/confirm-task",
      params: { id: task.id },
    });
  };

  return (
    <TouchableOpacity
      onPress={onTaskPress}
      disabled={!canOpenTask}
      style={[styles.container, dynamicStyles.container, globalStyles.kidShadow]}
    >
      <View style={styles.wrapper}>
        <View style={[styles.line, dynamicStyles.line]} />
        <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
