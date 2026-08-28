import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PageView from "@/components/ui/PageView";
import { ModalSkeleton } from "@/components/ui/skeletons/ModalSkeleton";
import { buttonVariant, rewardEmojiOptions, role } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";
import { getRewardImageUri } from "@/lib/utils/utils";

import { GetRewardDetails } from "../api/rewards.api";
import { useUpdateReward } from "../hooks/useUpdateReward";
import { RewardFormFields } from "./RewardFormFields";

type EditRewardModalUIProps = {
  rewardId: string;
  data?: GetRewardDetails | null;
  isLoading: boolean;
};

export function EditRewardModalUI({ rewardId, data, isLoading }: EditRewardModalUIProps) {
  const { t } = useTranslation();
  const router = useRouter();

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

    const imageUri = getRewardImageUri(data.imageUri, data.icon);

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
      <PageView modal screen={role.parent}>
        <ModalSkeleton />
      </PageView>
    );
  }

  return (
    <PageView
      modal
      screen={role.parent}
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: handleSaveReward,
          disabled:
            isDisabled || !rewardName.trim() || !isCoinAmountValid || updateReward.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: router.back,
          variant: buttonVariant.outline,
        },
      ]}
    >
      <RewardFormFields
        title={t("parent.rewards.editReward")}
        subtitle={t("parent.rewards.editRewardSubtitle")}
        rewardName={rewardName}
        onChangeRewardName={setRewardName}
        rewardCoins={rewardCoins}
        onChangeRewardCoins={setRewardCoins}
        rewardNameLabel={t("parent.rewards.rewardName")}
        rewardNamePlaceholder={t("parent.rewards.rewardPlaceholder")}
        coinCostLabel={t("parent.rewards.coinCost")}
        coinPlaceholder={t("onboarding.prize.coinsPlaceholder")}
        pickIconLabel={t("common.pickIcon")}
        selectedIcon={selectedIcon}
        onSelectIcon={(item) => {
          setSelectedIcon(item);
          setGiftImageUri(null);
          setGiftImageMimeType(null);
        }}
        giftImageUri={giftImageUri}
        onPickGiftImage={handlePickGiftImage}
      />
    </PageView>
  );
}
