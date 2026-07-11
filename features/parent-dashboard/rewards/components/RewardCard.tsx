import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { RewardCard } from "@/lib/types";

type RewardCardComponentProps = {
  item: RewardCard;
  onEditPress?: () => void;
};

export function RewardCardComponent({ item, onEditPress }: RewardCardComponentProps) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const imageUri = item.imageUri ?? (item.icon?.startsWith("http") ? item.icon : null);

  return (
    <ThemedView key={item.id} style={[styles.rewardsWrapepr, globalStyles.shadow]}>
      <View style={styles.rewardIconWrapepr}>
        <ThemedView style={[styles.rewardIcon, { backgroundColor: colors.lightGrey }]}>
          {imageUri ? (
            <Image source={imageUri} contentFit="cover" style={styles.rewardImage} />
          ) : (
            <ThemedText style={styles.rewardEmoji}>{item.icon ?? "🎁"}</ThemedText>
          )}
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

      <Pressable onPress={onEditPress} hitSlop={8}>
        <AppIcon icon={Icons.pencil} />
      </Pressable>
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
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  rewardImage: {
    width: "100%",
    height: "100%",
  },
  rewardEmoji: {
    fontSize: 24,
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
});
