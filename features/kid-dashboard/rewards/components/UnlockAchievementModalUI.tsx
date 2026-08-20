import { TFunction } from "i18next";
import { ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { CoinRainOverlay } from "@/components/ui/celebration/CoinRainOverlay";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { modalTop } from "@/lib/constants";
import { AchievementProgressItem } from "@/lib/types";

import { useClaimAchievement } from "../hooks/useClaimAchievement";
import { InfoWrapper } from "./BalanceComponent";
import { ProgressBar } from "./ProgressBar";

const ACHIEVEMENT_COIN_REWARD = 5;
const ACHIEVEMENT_XP_REWARD = 10;

type UnlockAchievementModalUIProps = {
  achievement?: AchievementProgressItem;
  childId?: string;
  isLoading?: boolean;
  loginCode?: string;
};

export function UnlockAchievementModalUI({
  achievement,
  childId,
  isLoading = false,
  loginCode,
}: UnlockAchievementModalUIProps) {
  const { t } = useTranslation();
  const claimAchievement = useClaimAchievement();
  const { isPending: isClaimAchievementPending, mutate: claimAchievementMutation } =
    claimAchievement;
  const [showCoinRain, setShowCoinRain] = useState(false);
  const canClaim = Boolean(
    childId && loginCode && achievement?.id && achievement.unlocked && !achievement.claimed,
  );
  const isClaiming = showCoinRain || isClaimAchievementPending;

  const onClaimPress = () => {
    if (!canClaim || isClaiming) return;

    setShowCoinRain(true);
  };

  const onCoinRainFinish = useCallback(() => {
    if (!canClaim || isClaimAchievementPending) return;

    setShowCoinRain(false);
    claimAchievementMutation({
      achievementId: achievement!.id,
      childId: childId!,
      loginCode: loginCode!,
    });
  }, [
    achievement,
    canClaim,
    childId,
    claimAchievementMutation,
    isClaimAchievementPending,
    loginCode,
  ]);

  const dynamicStyles = StyleSheet.create({
    title: {
      color: Palette.yellow,
      fontWeight: 800,
      textTransform: "uppercase",
    },
    greenText: {
      color: Palette.green,
    },
  });

  return (
    <ChildWrapper withStars withConfetti style={styles.wrapper}>
      <CustomScrollView contentContainerStyle={styles.scrollView}>
        <Header t={t} subtitleStyle={dynamicStyles.title} titleStyle={dynamicStyles.greenText} />

        <IconWrapper icon={achievement?.icon ?? "🌟"} />

        <ShowProgress
          titleStyle={dynamicStyles.title}
          title={
            achievement
              ? t(`kid.rewards.achievementItems.${achievement.id}.title`)
              : t("kid.rewards.achievement")
          }
        >
          <ProgressBar
            progressLabel={achievement?.progressLabel ?? t("kid.rewards.complete")}
            progress={achievement?.progress ?? 1}
            progressLabelStyle={[dynamicStyles.greenText, styles.font16]}
          />
        </ShowProgress>

        <UnlockedRewards t={t} />
      </CustomScrollView>
      <Button onPress={onClaimPress} loading={isLoading || isClaiming} disabled={!canClaim}>
        {t("kid.rewards.earn")}
      </Button>
      <CoinRainOverlay active={showCoinRain} onFinish={onCoinRainFinish} />
    </ChildWrapper>
  );
}

function Header({
  subtitleStyle,
  titleStyle,
  t,
}: {
  subtitleStyle: StyleProp<TextStyle>;
  titleStyle: StyleProp<TextStyle>;
  t: TFunction;
}) {
  return (
    <View style={styles.header}>
      <ThemedText child style={[styles.headerTitle, titleStyle]}>
        {t("common.congratulations")}
      </ThemedText>
      <ThemedText mono style={[styles.font24, subtitleStyle]}>
        {t("kid.rewards.newAchievementUnlocked")}
      </ThemedText>
    </View>
  );
}

function IconWrapper({ icon }: { icon: string }) {
  const dynamicStyles = StyleSheet.create({
    achivWrapper1: {
      borderColor: Palette.yellow,
      backgroundColor: Palette.darkBlue,
      shadowColor: Palette.yellow,
    },
    achivWrapper2: {
      borderColor: Palette.orange,
      backgroundColor: Palette.darkNavy,
    },
    achivWrapperRound: {
      borderColor: Palette.yellow,
      shadowColor: Palette.yellow,
    },
  });

  return (
    <View
      style={[styles.achivWrapper1, globalStyles.achievementShadow, dynamicStyles.achivWrapper1]}
    >
      <View style={[styles.achivWrapper2, dynamicStyles.achivWrapper2]}>
        <View
          style={[
            styles.achivWrapperRound,
            globalStyles.achievementShadow,
            dynamicStyles.achivWrapperRound,
          ]}
        >
          <Text style={styles.achievementIcon}>{icon}</Text>
        </View>
      </View>
    </View>
  );
}

function ShowProgress({
  title,
  titleStyle,
  children,
}: {
  title: string;
  titleStyle: StyleProp<TextStyle>;
  children: ReactNode;
}) {
  return (
    <View style={styles.progressWrapper}>
      <ThemedText mono style={[titleStyle, styles.font28]}>
        {title}
      </ThemedText>
      <View>{children}</View>
    </View>
  );
}

function UnlockedRewards({ t }: { t: TFunction }) {
  return (
    <ThemedView child style={styles.rewardPanel}>
      <ThemedText mono type="subtitle" style={styles.rewardTitle}>
        {t("kid.rewards.unlockedRewards")}
      </ThemedText>
      <View style={styles.rewardRow}>
        <InfoWrapper
          icon={Icons.coins}
          text={`+ ${ACHIEVEMENT_COIN_REWARD} ${t("common.coins")}`}
          color={Palette.yellow}
        />
        <InfoWrapper
          icon={Icons.lightning}
          text={`+ ${ACHIEVEMENT_XP_REWARD} ${t("common.xp")}`}
          color={Palette.blue}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: modalTop,
    paddingBottom: modalTop,
  },
  header: {
    alignItems: "center",
    gap: 8,
    width: "60%",
  },
  headerTitle: {
    fontSize: 22,
    textTransform: "uppercase",
    lineHeight: 26,
  },
  scrollView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    position: "relative",
    zIndex: 1,
  },
  progressWrapper: {
    gap: 8,
  },
  font24: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 28,
  },
  font28: {
    fontSize: 28,
    lineHeight: 30,
  },
  font16: {
    fontSize: 16,
  },
  achivWrapper1: {
    width: 150,
    height: 160,
    borderWidth: 4,
    borderRadius: 40,
    transform: [{ rotate: "-15deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  achivWrapper2: {
    width: 120,
    height: 130,
    borderWidth: 2,
    borderRadius: 32,
    transform: [{ rotate: "15deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  achivWrapperRound: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementIcon: {
    fontSize: 40,
  },
  rewardPanel: {
    padding: 16,
    gap: 12,
    alignSelf: "stretch",
  },
  rewardTitle: {
    textTransform: "uppercase",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
  rewardRow: {
    flexDirection: "row",
    gap: 12,
  },
});
