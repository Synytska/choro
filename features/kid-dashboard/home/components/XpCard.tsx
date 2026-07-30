import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

import { IconLabel } from "./IconLabel";

type XpCardProps = {
  doneTasks?: number;
  allTasks?: number;
  levelProgress?: number;
  xpCurrentLevel?: number;
  xpNextLevel?: number;
};

export function XpCard({
  doneTasks = 0,
  allTasks = 0,
  levelProgress = 0,
  xpCurrentLevel = 0,
  xpNextLevel = 60,
}: XpCardProps) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const totalTasks = Math.max(0, allTasks);
  const completedTasks = Math.max(0, Math.min(doneTasks, totalTasks));
  const progress = Math.max(0, Math.min(levelProgress, 1));
  const animatedProgress = useRef(new Animated.Value(progress)).current;
  const progressWidth = useMemo(
    () =>
      animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
      }),
    [animatedProgress],
  );

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress]);

  const dynamicStyles = StyleSheet.create({
    xpCard: {
      shadowColor: colors.green,
    },
    xpTitleText: {
      color: colors.white,
    },
    levelUpPill: {
      backgroundColor: colors.green,
      shadowColor: colors.green,
      borderWidth: 0,
    },
    levelUpText: {
      color: colors.darkNavy,
    },
    xpTrack: {
      borderColor: colors.borderBlue,
      backgroundColor: colors.progressGreen,
    },
    xpFill: {
      backgroundColor: colors.green,
    },
    xpMetaMuted: {
      color: colors.darkGrey,
    },
    xpMetaStrong: {
      color: colors.green,
    },
  });

  return (
    <ThemedView child style={[styles.xpCard, dynamicStyles.xpCard, globalStyles.shadow]}>
      <View style={styles.xpHeader}>
        <View style={styles.xpTitle}>
          <IconLabel
            style={[globalStyles.kidShadow, { shadowColor: colors.green }]}
            backgroundColor={colors.green}
            icon={<AppIcon icon={Icons.lightning} color={colors.darkNavy} size={18} />}
          />
          <ThemedText child style={[styles.xpTitleText, dynamicStyles.xpTitleText]}>
            {t("kid.home.xpProgress")}
          </ThemedText>
        </View>
        <Badge
          onPress={() => router.push("/(role-kid)/(tasks)")}
          icon={Icons.arrowUp}
          text={t("kid.home.levelUp")}
          iconSize={16}
          color={colors.darkNavy}
          style={[dynamicStyles.levelUpPill, styles.levelUpPill, globalStyles.kidShadow]}
        />
      </View>

      <View style={[styles.xpTrack, dynamicStyles.xpTrack]}>
        <Animated.View style={[styles.xpFill, dynamicStyles.xpFill, { width: progressWidth }]} />
      </View>

      <View style={styles.xpMeta}>
        <ThemedText mono style={[styles.xpMetaMuted, dynamicStyles.xpMetaMuted]}>
          {t("kid.home.quests", { done: completedTasks, all: totalTasks })}
        </ThemedText>
        <ThemedText mono style={[styles.xpMetaStrong, dynamicStyles.xpMetaStrong]}>
          {t("kid.home.xpLevelValue", {
            current: xpCurrentLevel,
            next: xpNextLevel,
          })}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  xpCard: {
    gap: 12,
    padding: 16,
  },
  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  xpTitleText: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  levelUpPill: {
    paddingVertical: 8,
    borderRadius: 100,
  },
  levelUpText: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 13,
  },
  xpTrack: {
    height: 18,
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 2,
  },
  xpFill: {
    height: "100%",
  },
  xpMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpMetaMuted: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "800",
  },
  xpMetaStrong: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 14,
    textTransform: "uppercase",
  },
});
