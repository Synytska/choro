import { ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ChildRewardsScreenSkeleton } from "@/components/ui/skeletons/kids/ChildRewardsScreenSkeleton";
import { ToggleBar } from "@/components/ui/ToggleBar";
import { useAppColors } from "@/hooks/use-app-colors";
import { achievements, rewardStatus, scrollViewTopKid } from "@/lib/constants";
import { RewardItem, RewardsTabValue, TabItem } from "@/lib/types";

import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";
import Achievements from "./components/Achievements";
import BalanceComponent from "./components/BalanceComponent";
import KidRewardCard from "./components/KidRewardCard";
import { calculateAchievements } from "./utils/achievementProgress";

export default function ChildrenRewardsUI() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<RewardsTabValue>("available");

  const { child, data: dashboardData, tasks, isLoading } = useKidDashboardTasks();
  const rewards = dashboardData?.rewards;
  const visibleRewards = useMemo(
    () =>
      (rewards ?? []).filter((reward) =>
        activeTab === "available"
          ? reward.status === rewardStatus.available
          : reward.status === rewardStatus.requested || reward.status === rewardStatus.given,
      ),
    [activeTab, rewards],
  );
  const achievementItems = useMemo(
    () =>
      calculateAchievements(achievements, {
        child,
        tasks,
        rewards,
        achievementStats: dashboardData?.achievementStats,
        childAchievements: dashboardData?.childAchievements,
      }),
    [child, dashboardData?.achievementStats, dashboardData?.childAchievements, rewards, tasks],
  );

  const dynamicStyles = StyleSheet.create({
    text: {
      color: colors.white,
    },
    textGreen: {
      color: colors.green,
    },
    label: {
      backgroundColor: colors.greenDone,
    },
  });

  return (
    <ChildWrapper>
      <CustomScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        {isLoading ? (
          <ChildRewardsScreenSkeleton />
        ) : (
          <>
            {/* Reward Shop */}
            <SectionWrapper title={t("kid.rewards.rewardShop")} style={dynamicStyles.textGreen}>
              <BalanceComponent coins={child?.coinBalance ?? 0} xp={child?.xpTotal ?? 0} />
            </SectionWrapper>

            <PickReward
              style={dynamicStyles.text}
              activeTab={activeTab}
              onChange={setActiveTab}
              visibleRewards={visibleRewards}
              coins={child?.coinBalance}
            />

            <SectionWrapper title={t("kid.rewards.achievements")} style={dynamicStyles.textGreen}>
              <Achievements data={achievementItems} />
            </SectionWrapper>
          </>
        )}
      </CustomScrollView>
    </ChildWrapper>
  );
}

function SectionWrapper({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.rewardWrapper}>
      <ThemedText child style={[styles.header, style]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

function PickReward({
  style,
  onChange,
  activeTab,
  visibleRewards,
  coins,
}: {
  style: StyleProp<TextStyle>;
  onChange: (value: RewardsTabValue) => void;
  activeTab: RewardsTabValue;
  visibleRewards: RewardItem[];
  coins?: number;
}) {
  const { t } = useTranslation();

  const tabs: TabItem<RewardsTabValue>[] = [
    {
      icon: Icons.calendar,
      title: t("kid.rewards.available"),
      value: "available",
    },
    {
      icon: Icons.pending,
      title: t("kid.rewards.redeemed"),
      value: "redeemed",
    },
  ];

  return (
    <SectionWrapper title={t("kid.rewards.pickReward")} style={style}>
      <ToggleBar tabs={tabs} activeTab={activeTab} onChange={onChange} />

      <View style={styles.rewardsCard}>
        {visibleRewards.map((reward) => (
          <KidRewardCard key={reward.id} item={reward} totalCoins={coins ?? 0} />
        ))}
      </View>
    </SectionWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    zIndex: 100,
  },
  container: {
    marginTop: scrollViewTopKid,
    gap: 20,
  },
  header: {
    fontSize: 28,
    textTransform: "uppercase",
  },
  rewardWrapper: {
    gap: 20,
  },
  rewardsCard: {
    gap: 12,
  },
});
