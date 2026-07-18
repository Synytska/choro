import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";
import { TaskItem } from "@/lib/types";

interface QuestListProps {
  task: TaskItem;
  index: number;
}

export function QuestList({ task, index }: QuestListProps) {
  const colors = useAppColors();

  const questThemes = [
    {
      border: colors.orange,
      accent: colors.orange,
      iconBg: colors.orange,
    },
    {
      border: colors.blue,
      accent: colors.blue,
      iconBg: colors.blue,
    },
    {
      border: colors.yellow,
      accent: colors.yellow,
      iconBg: colors.yellow,
    },
  ] as const;

  const completedTheme = {
    border: colors.green,
    accent: colors.green,
    iconBg: colors.green,
  };

  const theme =
    task.status === taskStatus.done ? completedTheme : questThemes[index % questThemes.length];

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: theme.border,
      backgroundColor: colors.darkNavy,
      shadowColor: theme.accent,
    },
    line: {
      backgroundColor: theme.accent,
    },
    iconContainer: {
      backgroundColor: theme.iconBg,
    },
    title: {
      color: colors.white,
    },
    coins: {
      color: colors.yellow,
    },
    checkboxColor: {
      borderColor: theme.border,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container, globalStyles.kidShadow]}>
      <View style={styles.wrapper}>
        <View style={[styles.line, dynamicStyles.line]} />
        <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
          <Text style={{ fontSize: 16 }}>{task.emoji}</Text>
        </View>
        <View style={styles.titleWrapper}>
          <ThemedText mono style={[styles.title, dynamicStyles.title]}>
            {task.title}
          </ThemedText>
          <View style={styles.coinsWrapper}>
            <AppIcon icon={Icons.coins} size={16} color={colors.yellow} />
            <ThemedText style={[styles.coins, dynamicStyles.coins]}>+ {task.coinReward}</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.checkboxWrapper, dynamicStyles.checkboxColor]}>
        <View style={[styles.checkbox, dynamicStyles.checkboxColor]} />
      </TouchableOpacity>
    </View>
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
