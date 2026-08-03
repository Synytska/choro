import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import MiniButton from "@/components/ui/MiniButton";
import { Palette } from "@/constants/theme";
import { achivExperience, levelUpCoins } from "@/lib/constants";
import { AchievementProgressItem } from "@/lib/types";

import { ProgressBar } from "./ProgressBar";

type AchievementsProps = {
  data: AchievementProgressItem[];
};

export default function Achievements({ data }: AchievementsProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const [moreCardId, setMoreCardId] = useState("");

  const renderItem = ({ item }: { item: AchievementProgressItem }) => {
    const isMoreCardVisible = item.id === moreCardId;
    const isUnavailable = Boolean(item.unavailableReason);
    const borderColor = item.unlocked ? Palette.yellow : Palette.darkGrey;
    const buttonBackground = item.claimed
      ? Palette.green
      : item.unlocked
        ? Palette.orange
        : Palette.darkGrey;
    const titleBackground = item.claimed ? Palette.black : Palette.white;
    const title = t(`kid.rewards.achievementItems.${item.id}.title`);
    const description = t(`kid.rewards.achievementItems.${item.id}.description`);
    const buttonTitle = item.claimed
      ? t("kid.rewards.claimed")
      : item.unlocked
        ? t("kid.rewards.claim")
        : isUnavailable
          ? t("kid.rewards.soon")
          : t("kid.rewards.locked");
    const canClaim = Boolean(item.unlocked && !item.claimed);
    const onClaimPress = () => {
      if (!canClaim) return;

      router.push({
        pathname: "/unlock-achievement-modal",
        params: {
          achievementId: item.id,
        },
      });
    };

    return (
      <ThemedView child style={[styles.wrapper, { borderColor }]}>
        <View style={[styles.iconWrapper, { borderColor }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <TouchableOpacity
          hitSlop={30}
          onPress={() => setMoreCardId(item.id)}
          style={styles.moreIcon}
        >
          <AppIcon icon={Icons.more} color={Palette.middleGrey} size={20} />
        </TouchableOpacity>
        <View style={styles.achivRewards}>
          <View style={styles.achivRewardsWrapp}>
            <ThemedText child style={[{ color: Palette.yellow }, styles.achivRewardsText]}>
              +{levelUpCoins}
            </ThemedText>
            <AppIcon icon={Icons.coins} size={12} color={Palette.yellow} />
          </View>
          <View style={styles.achivRewardsWrapp}>
            <ThemedText child style={[styles.achivRewardsText, { color: Palette.blue }]}>
              +{achivExperience}
            </ThemedText>
            <AppIcon icon={Icons.lightning} size={12} color={Palette.blue} />
          </View>
        </View>

        <ThemedText child style={styles.title}>
          {title}
        </ThemedText>

        <ProgressBar progressLabel={item.progressLabel} progress={item.progress} />

        <MiniButton
          buttonStyle={[styles.button, { backgroundColor: buttonBackground }]}
          textStyle={[styles.buttonText, { color: titleBackground }]}
          title={buttonTitle}
          onPress={onClaimPress}
          disabled={!canClaim}
        />

        {isMoreCardVisible && (
          <View style={[StyleSheet.absoluteFill, styles.moreCard]}>
            <IconButton
              icon={Icons.close}
              size={20}
              iconSize={20}
              borderColor={Palette.darkNavy}
              onPress={() => setMoreCardId("")}
            />
            <ThemedText child style={[styles.moreText]}>
              {description}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    );
  };

  return (
    <CustomFlatList
      contentContainerStyle={styles.flatList}
      keyExtractor={(item) => item.id}
      data={data}
      renderItem={renderItem}
      horizontal
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: 194,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    flexWrap: "wrap",
    textAlign: "center",
    color: Palette.white,
  },
  flatList: {
    gap: 12,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
  },
  moreIcon: {
    position: "absolute",
    right: 10,
    top: 6,
  },
  moreCard: {
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    opacity: 0.9,
    backgroundColor: Palette.orange,
  },
  moreText: {
    fontSize: 20,
    lineHeight: 22,
  },
  achivRewards: {
    position: "absolute",
    left: 10,
    top: 10,
    gap: 4,
  },
  achivRewardsWrapp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  achivRewardsText: {
    lineHeight: 14,
    fontSize: 14,
    color: Palette.yellow,
  },
});
