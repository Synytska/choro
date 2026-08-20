/**
 * Parent confirmation modal for a reward requested by a child.
 *
 * Props:
 * - child: child details used for context in the modal.
 * - reward: requested reward details to confirm as given.
 * - isLoading: shows a loading state while route data is being fetched.
 */
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import PageView from "@/components/ui/PageView";
import { ModalSkeleton } from "@/components/ui/skeletons/ModalSkeleton";
import { Palette } from "@/constants/theme";
import { IconLabel } from "@/features/kid-dashboard/home/components/IconLabel";
import { globalStyles } from "@/features/styles";
import { buttonVariant, rewardStatus, role } from "@/lib/constants";
import { ChildCard } from "@/lib/types";

import { GetRewardDetails } from "../api/rewards.api";
import { useGiveReward } from "../hooks/useGiveReward";

type GiveGiftModalUIProps = {
  child?: ChildCard;
  reward?: GetRewardDetails | null;
  isLoading: boolean;
};

export function GiveGiftModalUI({ child, reward, isLoading }: GiveGiftModalUIProps) {
  const { t } = useTranslation();
  const giveReward = useGiveReward();
  const isRequested = reward?.status === rewardStatus.requested;

  const onCancel = () => {
    router.back();
  };

  const onConfirm = () => {
    if (!reward?.id || giveReward.isPending) return;

    giveReward.mutate({ rewardId: reward.id });
  };

  if (isLoading) {
    return (
      <PageView modal screen={role.parent}>
        <ModalSkeleton />
      </PageView>
    );
  }

  if (!child || !reward) {
    return (
      <PageView
        modal
        screen={role.parent}
        buttons={[{ title: t("common.cancel"), onPress: onCancel, variant: buttonVariant.outline }]}
      >
        <View style={styles.centerContent}>
          <ThemedText style={styles.title}>{t("parent.children.giveGiftTitle")}</ThemedText>
          <ThemedText type="subtitle">{t("parent.children.giftNotFound")}</ThemedText>
        </View>
      </PageView>
    );
  }

  return (
    <PageView
      modal
      screen={role.parent}
      buttons={[
        {
          title: t("parent.children.giftButton"),
          onPress: onConfirm,
          disabled: !isRequested || giveReward.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: onCancel,
          variant: buttonVariant.outline,
          disabled: giveReward.isPending,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{t("parent.children.giveGiftTitle")}</ThemedText>
            <Text style={styles.icon}>🎁</Text>
          </View>
          <ThemedText type="subtitle" style={styles.subtl}>
            {t("parent.children.forChild", { name: child.name })}
          </ThemedText>
        </View>

        <ThemedView style={[styles.rewardCard, globalStyles.shadow]}>
          <View style={styles.giftTitle}>
            <IconLabel
              backgroundColor={Palette.lightYellow}
              icon={<Text style={styles.icon}>🎁</Text>}
              size={50}
              style={styles.iconRound}
            />
            <ThemedText mono type="subtitle" style={styles.subtl}>
              {t("parent.children.kidChose", { name: child.name })}
            </ThemedText>
          </View>

          <View style={styles.rewardMedia}>
            {reward.imageUri ? (
              <Image source={reward.imageUri} contentFit="cover" style={styles.rewardImage} />
            ) : (
              <Text style={styles.rewardEmoji}>{reward.icon ?? "🎁"}</Text>
            )}
          </View>

          <View style={styles.rewardInfo}>
            <ThemedText style={styles.rewardName}>{reward.name}</ThemedText>
            <View style={styles.coinsRow}>
              <AppIcon icon={Icons.coins} size={16} color={Palette.orange} />
              <ThemedText style={styles.coinsText}>
                {reward.coinAmount} {t("common.coins")}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {!isRequested ? (
          <ThemedText type="subtitle">{t("parent.children.giftAlreadyHandled")}</ThemedText>
        ) : null}
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  content: {
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  subtl: {
    fontSize: 15,
    fontWeight: 600,
  },
  giftTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconRound: {
    borderRadius: 50,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  rewardCard: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  rewardMedia: {
    width: 200,
    height: 200,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: Palette.lightGrey,
  },
  rewardImage: {
    width: "100%",
    height: "100%",
  },
  rewardEmoji: {
    fontSize: 54,
  },
  rewardInfo: {
    gap: 8,
  },
  rewardName: {
    fontSize: 20,
    fontWeight: "800",
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.orange,
  },
});
