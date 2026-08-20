import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { MultiSelect } from "@/components/ui/MultiSelect";
import PageView from "@/components/ui/PageView";
import { buttonVariant, rewardEmojiOptions, role } from "@/lib/constants";
import { MultiSelectOption } from "@/lib/types";
import { pickImage } from "@/lib/utils/image-picker";

import { useChildren } from "../../children/hooks/useChildren";
import { useCreateReward } from "../hooks/useCreateReward";
import { RewardFormFields } from "./RewardFormFields";

export function CreateRewardModalUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const { childId } = useLocalSearchParams<{ childId?: string }>();

  const [rewardName, setRewardName] = useState("");
  const [rewardCoins, setRewardCoins] = useState("");
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);
  const [giftImageMimeType, setGiftImageMimeType] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const initialChildApplied = useRef(false);

  const { data: dashboardData } = useChildren();
  const createReward = useCreateReward();

  const iconDisabled = !!giftImageUri;

  const childOptions = useMemo<MultiSelectOption[]>(
    () =>
      (dashboardData?.children ?? []).map((child) => ({
        id: child.id,
        label: child.name,
        value: child.name,
      })),
    [dashboardData?.children],
  );

  useEffect(() => {
    if (giftImageUri) {
      setSelectedIcon("");
    } else {
      setSelectedIcon(rewardEmojiOptions[0]);
    }
  }, [giftImageUri]);

  useEffect(() => {
    if (initialChildApplied.current || !childId) return;

    const childExists = childOptions.some((option) => option.id === childId);

    if (!childExists) return;

    setSelectedChildren([childId]);
    initialChildApplied.current = true;
  }, [childId, childOptions]);

  const handlePickGiftImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setGiftImageUri(image.uri);
    setGiftImageMimeType(image.mimeType ?? null);
  };

  const handleSaveReward = () => {
    createReward.mutate(
      {
        childIds: selectedChildren,
        name: rewardName,
        coinAmount: Number(rewardCoins),
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

  return (
    <PageView
      modal
      containerStyle={styles.pageView}
      screen={role.parent}
      buttons={[
        {
          title: t("parent.rewards.saveReward"),
          onPress: handleSaveReward,
          disabled:
            !rewardName.trim() ||
            !rewardCoins ||
            !selectedChildren.length ||
            createReward.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: router.back,
          variant: buttonVariant.outline,
        },
      ]}
    >
      <RewardFormFields
        title={t("parent.rewards.addNewReward")}
        subtitle={t("parent.rewards.rewardsSubtitle")}
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
        onSelectIcon={setSelectedIcon}
        iconDisabled={iconDisabled}
        giftImageUri={giftImageUri}
        onPickGiftImage={handlePickGiftImage}
      >
        <MultiSelect
          label={t("parent.rewards.assignTo")}
          options={childOptions}
          selectedValues={selectedChildren}
          onChange={setSelectedChildren}
          placeholder={t("parent.rewards.selectChildren")}
        />
      </RewardFormFields>
    </PageView>
  );
}

const styles = StyleSheet.create({
  pageView: {
    paddingTop: 44,
    marginTop: 0,
  },
});
