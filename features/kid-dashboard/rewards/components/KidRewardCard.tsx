import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import MiniButton from "@/components/ui/MiniButton";
import { useRequestReward } from "@/features/parent-dashboard/rewards/hooks/useRequestReward";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { rewardStatus } from "@/lib/constants";
import { RewardItem } from "@/lib/types";
import { selectAuthUserId, selectAuthUserLoginCode } from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { IconLabel } from "../../home/components/IconLabel";

export default function KidRewardCard({
  item,
  totalCoins,
}: {
  item: RewardItem;
  totalCoins: number;
}) {
  const colors = useAppColors();
  const { t } = useTranslation();
  const childId = useAppSelector(selectAuthUserId);
  const loginCode = useAppSelector(selectAuthUserLoginCode);
  const requestReward = useRequestReward();

  const isAvailable = item.status === rewardStatus.available;
  const isRequested = item.status === rewardStatus.requested;
  const isGiven = item.status === rewardStatus.given;
  const allowRedeem = isAvailable && totalCoins >= item.coinAmount;
  const isButtonDisabled = !allowRedeem || requestReward.isPending;
  const buttonTitle = isRequested
    ? t("kid.rewards.waitingForParent")
    : isGiven
      ? t("kid.rewards.redeemed")
      : allowRedeem
        ? t("kid.rewards.redeem")
        : t("kid.rewards.locked");

  const onRedeemPress = () => {
    if (!childId || !loginCode || !allowRedeem || requestReward.isPending) return;

    requestReward.mutate({
      childId,
      loginCode,
      rewardId: item.id,
    });
  };

  const dynamicStyles = StyleSheet.create({
    text: {
      color: colors.white,
    },
    active: {
      shadowColor: colors.yellow,
      borderColor: colors.yellow,
    },
    borderYellow: {
      borderColor: colors.yellow,
    },
    textYellow: {
      color: colors.yellow,
    },
    backGreen: {
      backgroundColor: allowRedeem ? colors.green : colors.borderBlue,
    },
    textBlack: {
      color: allowRedeem ? colors.black : colors.darkGrey,
    },
  });

  return (
    <ThemedView
      child
      style={[
        styles.wrapper,
        globalStyles.rowBetween,
        globalStyles.kidShadow,
        allowRedeem && dynamicStyles.active,
      ]}
    >
      <View style={[styles.gap12, styles.flexCenter]}>
        {item.imageUri ? (
          <View style={[styles.imageWrapper, allowRedeem && dynamicStyles.borderYellow]}>
            <Image source={item.imageUri} style={styles.image} contentFit="cover" />
          </View>
        ) : (
          <IconLabel
            size={50}
            backgroundColor={allowRedeem ? colors.yellow : colors.borderBlue}
            icon={<Text style={styles.emoji}>{item.icon}</Text>}
          />
        )}

        <View style={styles.textWrapper}>
          <ThemedText child style={[styles.rewardText, dynamicStyles.text]}>
            {item.name}
          </ThemedText>
          <View style={[styles.gap8, styles.flexCenter]}>
            <AppIcon icon={Icons.coins} size={14} color={colors.yellow} />
            <ThemedText child style={[styles.coinsText, dynamicStyles.textYellow]}>
              {item.coinAmount} {t("common.coins")}
            </ThemedText>
          </View>
        </View>
      </View>

      <MiniButton
        buttonStyle={dynamicStyles.backGreen}
        textStyle={dynamicStyles.textBlack}
        disabled={isButtonDisabled}
        onPress={onRedeemPress}
        title={buttonTitle}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 14,
  },
  gap12: {
    gap: 12,
  },
  gap8: {
    gap: 8,
  },
  flexCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  emoji: {
    fontSize: 24,
  },
  textWrapper: {
    gap: 6,
  },
  rewardText: {
    fontSize: 20,
    lineHeight: 22,
  },
  coinsText: {
    fontSize: 14,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
  },
});
