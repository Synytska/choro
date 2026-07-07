import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconPicker } from "@/components/ui/IconPicker";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import PageView from "@/components/ui/PageView";
import { Separator } from "@/components/ui/Separator";
import { useAppColors } from "@/hooks/use-app-colors";
import { rewardEmojiOptions } from "@/lib/constants";
import { MultiSelectOption } from "@/lib/types";
import { pickImage } from "@/lib/utils/image-picker";

import { useChildren } from "../../children/hooks/useChildren";
import { useCreateReward } from "../hooks/useCreateReward";

export function CreateRewardModalUI() {
  const { t } = useTranslation();
  const router = useRouter();

  const [rewardName, setRewardName] = useState("");
  const [rewardCoins, setRewardCoins] = useState("");
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);
  const [giftImageMimeType, setGiftImageMimeType] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

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
      containerStyle={styles.pageView}
      background="parent"
      hasBottomPadding
      buttons={[
        {
          title: t("p-dashboard.rewards.saveReward"),
          onPress: handleSaveReward,
          disabled:
            !rewardName.trim() ||
            !rewardCoins ||
            !selectedChildren.length ||
            createReward.isPending,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("p-dashboard.rewards.addNewReward")}</ThemedText>
          <ThemedText type="subtitle">{t("p-dashboard.rewards.rewardsSubtitle")}</ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={styles.fieldsWrapper}
          showsVerticalScrollIndicator={false}
        >
          <Input
            label={t("p-dashboard.rewards.rewardName")}
            placeholder={t("p-dashboard.rewards.rewardPlaceholder")}
            value={rewardName}
            onChangeText={setRewardName}
          />

          <MultiSelect
            label={t("p-dashboard.rewards.assignTo")}
            options={childOptions}
            selectedValues={selectedChildren}
            onChange={setSelectedChildren}
            placeholder={t("p-dashboard.rewards.selectChildren")}
          />

          {/* Set coin prize */}
          <View style={styles.coinWrapper}>
            <ThemedText style={styles.coinText}>{t("p-dashboard.rewards.coinCost")}</ThemedText>
            <Input
              value={rewardCoins}
              onChangeText={setRewardCoins}
              keyboardType="number-pad"
              placeholder={t("onboarding.prize.coinsPlaceholder")}
            />
          </View>

          {/* Pick Icon or Image */}
          <View style={styles.pickerWrapper}>
            <IconPicker
              data={rewardEmojiOptions}
              onPress={(item) => setSelectedIcon(item)}
              title={t("common.pickIcon")}
              selectedIcon={selectedIcon}
              disabled={iconDisabled}
            />
            <Separator />
            <CustomImagePicker uri={giftImageUri} onPress={handlePickGiftImage} />
          </View>
        </ScrollView>
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
  stepperWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
});
