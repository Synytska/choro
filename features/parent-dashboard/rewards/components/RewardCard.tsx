import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { RewardCard } from "@/lib/types";
import { getRewardImageUri } from "@/lib/utils/utils";

type RewardCardComponentProps = {
  item: RewardCard;
  onEditPress?: () => void;
};

export function RewardCardComponent({ item, onEditPress }: RewardCardComponentProps) {
  const { t } = useTranslation();

  const imageUri = getRewardImageUri(item.imageUri, item.icon);

  return (
    <ThemedView key={item.id} style={[styles.rewardsWrapper, globalStyles.shadow]}>
      <View style={styles.rewardIconWrapper}>
        <ThemedView style={styles.rewardIcon}>
          {imageUri ? (
            <Image source={imageUri} contentFit="cover" style={styles.rewardImage} />
          ) : (
            <Text style={styles.rewardEmoji}>{item.icon ?? "🎁"}</Text>
          )}
        </ThemedView>

        <View>
          <ThemedText style={styles.rewardTitle}>{item.title}</ThemedText>
          <View style={styles.rewardCoins}>
            <AppIcon icon={Icons.coins} size={14} color={Palette.orange} />
            <ThemedText style={styles.rewardCoinsText}>
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
  rewardsWrapper: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardIconWrapper: {
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
    backgroundColor: Palette.lightGrey,
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
    color: Palette.orange,
  },
});
