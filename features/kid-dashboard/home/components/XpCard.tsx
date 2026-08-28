import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { textType } from "@/lib/constants";

import { IconLabel } from "./IconLabel";

type XpCardProps = {
  levelProgress?: number;
  xpCurrentLevel?: number;
  xpNextLevel?: number;
  coins?: number;
};

export function XpCard({
  levelProgress = 0,
  xpCurrentLevel = 0,
  xpNextLevel = 60,
  coins = 0,
}: XpCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
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

  return (
    <ThemedView child style={[styles.xpCard, globalStyles.shadow]}>
      <View style={styles.xpHeader}>
        <View style={styles.xpTitle}>
          <IconLabel
            style={[globalStyles.kidShadow, { shadowColor: Palette.green }]}
            backgroundColor={Palette.green}
            icon={<AppIcon icon={Icons.lightning} color={Palette.darkNavy} size={18} />}
          />
          <ThemedText type={textType.subtitleChild} style={styles.xpTitleText}>
            {t("kid.home.xpProgress")}
          </ThemedText>
        </View>
        <Badge
          onPress={() => router.push("/(role-kid)/(tasks)")}
          icon={Icons.arrowUp}
          text={t("kid.home.levelUp")}
          iconSize={16}
          color={Palette.darkNavy}
          style={[styles.levelUpPill, globalStyles.kidShadow]}
        />
      </View>

      <View style={styles.xpTrack}>
        <Animated.View style={[styles.xpFill, { width: progressWidth }]} />
      </View>

      <View style={styles.xpMeta}>
        <View style={styles.balanceWrapper}>
          <ThemedText child style={styles.xpMetaMuted}>
            {t("common.balance")}
          </ThemedText>
          <ThemedText child style={styles.xpMetaMuted}>
            {coins}
          </ThemedText>
          <AppIcon icon={Icons.coins} size={14} color={Palette.yellow} />
        </View>
        <ThemedText mono style={styles.xpMetaStrong}>
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
    shadowColor: Palette.green,
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
    textTransform: "uppercase",
    color: Palette.white,
  },
  levelUpPill: {
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Palette.green,
    shadowColor: Palette.green,
    borderWidth: 0,
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
    borderColor: Palette.borderBlue,
    backgroundColor: Palette.progressGreen,
  },
  xpFill: {
    height: "100%",
    backgroundColor: Palette.green,
  },
  xpMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpMetaMuted: {
    fontSize: 16,
    textTransform: "uppercase",
    color: Palette.yellow,
  },
  xpMetaStrong: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 14,
    textTransform: "uppercase",
    color: Palette.green,
  },
  balanceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
});
