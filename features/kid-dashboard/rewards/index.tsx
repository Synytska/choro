import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useAppColors } from "@/hooks/use-app-colors";
import { achievements, scrollViewTopKid } from "@/lib/constants";

import { useKidDashboard } from "../home/hooks/useKidDashboard";
import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";
import Achievements from "./components/Achievements";
import BalanceComponent from "./components/BalanceComponent";
import KidRewardCard from "./components/KidRewardCard";

export default function ChildrenRewardsUI() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const { child } = useKidDashboardTasks();
  const { data: dashboardData, isLoading } = useKidDashboard();
  const rewards = dashboardData?.rewards;

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
        <ThemedText child style={[styles.header, dynamicStyles.textGreen]}>
          {t("kid.rewards.rewardShop")}
        </ThemedText>

        <BalanceComponent coins={child?.coinBalance ?? 0} xp={child?.xpTotal ?? 0} />

        <View style={styles.rewardWrapper}>
          <ThemedText child style={[styles.header, dynamicStyles.text]}>
            {t("kid.rewards.pickReward")}
          </ThemedText>
          <View style={styles.rewardsCard}>
            {rewards?.map((reward) => (
              <KidRewardCard key={reward.id} item={reward} totalCoins={child?.coinBalance ?? 0} />
            ))}
          </View>
        </View>
        <View style={styles.rewardWrapper}>
          <ThemedText child style={[styles.header, dynamicStyles.textGreen]}>
            {t("kid.rewards.achievements")}
          </ThemedText>
          <Achievements data={achievements} />
        </View>
      </CustomScrollView>
    </ChildWrapper>
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
