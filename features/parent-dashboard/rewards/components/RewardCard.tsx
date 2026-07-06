import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { RewardCard } from "@/lib/types";

type RewardCardComponentProps = {
  item: RewardCard;
};

export function RewardCardComponent({ item }: RewardCardComponentProps) {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <ThemedView key={item.id} style={[styles.rewardsWrapepr, globalStyles.shadow]}>
      <View style={styles.rewardIconWrapepr}>
        <ThemedView style={[styles.rewardIcon, { backgroundColor: colors.lightGrey }]}>
          <ThemedText>{item.icon}</ThemedText>
        </ThemedView>

        <View>
          <ThemedText style={styles.rewardTitle}>{item.title}</ThemedText>
          <View style={styles.rewardCoins}>
            <AppIcon icon={Icons.coins} size={14} color={colors.orange} />
            <ThemedText style={[styles.rewardCoinsText, { color: colors.orange }]}>
              {`${item.coins} ${t("common.coins")}`}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.rewardEditWrapper}>
        <AppIcon icon={Icons.pencil} size={30} color={colors.darkGrey} />
        <AppIcon icon={Icons.bin} size={30} color={colors.logoDotRed} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  rewardsWrapepr: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardIconWrapepr: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardIcon: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  rewardCoins: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  rewardCoinsText: {
    fontSize: 14,
    fontWeight: 700,
  },
  rewardEditWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
