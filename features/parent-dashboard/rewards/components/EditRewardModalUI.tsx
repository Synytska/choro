import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconPicker } from "@/components/ui/IconPicker";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { ModalSceleton } from "@/components/ui/sceleton/ModalSceleton";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Separator } from "@/components/ui/Separator";
import { useAppColors } from "@/hooks/use-app-colors";
import { rewardEmojiOptions, screenBackground } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";

import { GetRewardDetails } from "../api/rewards.api";
import { useUpdateReward } from "../hooks/useUpdateReward";

type EditRewardModalUIProps = {
  rewardId: string;
  data?: GetRewardDetails | null;
  isLoading: boolean;
};

export function EditRewardModalUI({ rewardId, data, isLoading }: EditRewardModalUIProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useAppColors();

  const [rewardName, setRewardName] = useState("");
  const [rewardCoins, setRewardCoins] = useState("");
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);
  const [giftImageMimeType, setGiftImageMimeType] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");

  const updateReward = useUpdateReward();
  const coinAmount = Number(rewardCoins);
  const isCoinAmountValid = Number.isFinite(coinAmount) && coinAmount >= 1;
  const isDisabled =
    rewardName === data?.name && coinAmount === data?.coinAmount && selectedIcon === data.icon;

  useEffect(() => {
    if (!data) return;

    const imageUri = data.imageUri ?? (data.icon?.startsWith("http") ? data.icon : null);

    setRewardName(data.name);
    setRewardCoins(String(data.coinAmount));
    setGiftImageUri(imageUri);
    setGiftImageMimeType(null);
    setSelectedIcon(imageUri ? "" : data.icon || rewardEmojiOptions[0]);
  }, [data]);

  const handlePickGiftImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setGiftImageUri(image.uri);
    setGiftImageMimeType(image.mimeType ?? null);
    setSelectedIcon("");
  };

  const handleSaveReward = () => {
    updateReward.mutate(
      {
        rewardId,
        name: rewardName,
        coinAmount,
        icon: selectedIcon,
        imageUri: giftImageUri,
        imageMimeType: giftImageMimeType,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <PageView containerStyle={styles.pageView} screen={screenBackground.parent}>
        <ModalSceleton />
      </PageView>
    );
  }

  return (
    <PageView
      containerStyle={styles.pageView}
      screen={screenBackground.parent}
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: handleSaveReward,
          disabled:
            isDisabled || !rewardName.trim() || !isCoinAmountValid || updateReward.isPending,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("parent.rewards.editReward")}</ThemedText>
          <ThemedText type="subtitle">{t("parent.rewards.editRewardSubtitle")}</ThemedText>
        </View>

        <CustomScrollView contentContainerStyle={styles.fieldsWrapper}>
          <Input
            label={t("parent.rewards.rewardName")}
            placeholder={t("parent.rewards.rewardPlaceholder")}
            value={rewardName}
            onChangeText={setRewardName}
          />

          <View style={styles.coinWrapper}>
            <ThemedText style={styles.coinText}>{t("parent.rewards.coinCost")}</ThemedText>
            <Input
              value={rewardCoins}
              onChangeText={setRewardCoins}
              keyboardType="number-pad"
              placeholder={t("onboarding.prize.coinsPlaceholder")}
            />
          </View>

          <View style={styles.pickerWrapper}>
            <IconPicker
              data={rewardEmojiOptions}
              onPress={(item) => {
                setSelectedIcon(item);
                setGiftImageUri(null);
                setGiftImageMimeType(null);
              }}
              title={t("common.pickIcon")}
              selectedIcon={selectedIcon}
            />
            <Separator />
            <CustomImagePicker customText="🎁" uri={giftImageUri} onPress={handlePickGiftImage} />
          </View>
        </CustomScrollView>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  pageView: {
    paddingTop: 44,
    marginTop: 0,
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  fieldsWrapper: {
    gap: 20,
    flexGrow: 1,
  },
  coinWrapper: {
    gap: 10,
  },
  coinText: {
    fontSize: 13,
    fontWeight: 600,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  pickerWrapper: {
    gap: 32,
  },
});
