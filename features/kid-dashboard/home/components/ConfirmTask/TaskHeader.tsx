import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { getDefaultTaskTitle } from "@/lib/defaultTasks";
import { TaskItem } from "@/lib/types";

import { IconLabel } from "../IconLabel";

export function TaskHeader({ color, task }: { color: string; task?: TaskItem }) {
  const { t } = useTranslation();
  const title = task ? getDefaultTaskTitle(task, t) : "";

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: color,
      shadowColor: color,
    },
    labelXP: {
      backgroundColor: Palette.green,
    },
    labelCoins: {
      backgroundColor: Palette.yellow,
    },
  });

  return (
    <ThemedView child style={[styles.container, dynamicStyles.container, globalStyles.kidShadow]}>
      <IconLabel
        size={64}
        backgroundColor={color ?? Palette.green}
        icon={<Text style={styles.icon}>{task?.emoji}</Text>}
      />

      <View style={styles.wrapper}>
        <ThemedText child style={styles.header}>
          {title}
        </ThemedText>

        <View style={styles.labelWrapper}>
          <View style={[styles.label, dynamicStyles.labelXP]}>
            <ThemedText style={styles.labelText}>+{task?.xpReward}</ThemedText>
            <AppIcon icon={Icons.lightning} color={Palette.black} size={14} />
          </View>
          <View style={[styles.label, dynamicStyles.labelCoins]}>
            <ThemedText style={styles.labelText}>+{task?.coinReward}</ThemedText>
            <AppIcon icon={Icons.coins} color={Palette.black} size={14} />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderWidth: 3,
  },
  icon: {
    fontSize: 32,
  },
  wrapper: {
    gap: 4,
  },
  header: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: "700",
    textTransform: "uppercase",
    color: Palette.white,
  },
  labelWrapper: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  labelText: {
    fontWeight: "800",
    fontSize: 14,
    color: Palette.black,
  },
});
