import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconPicker } from "@/components/ui/IconPicker";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { Separator } from "@/components/ui/Separator";
import { Stepper } from "@/components/ui/Stepper";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { rewardEmojiOptions } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";
import { useAppDispatch } from "@/store/hooks";

export function CreateRewardModalUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colors = useAppColors();

  const [rewardName, setRewardName] = useState("");
  const [rewardCoins, setRewardCoins] = useState(1);
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");

  const iconDisabled = !!giftImageUri;

  useEffect(() => {
    if (giftImageUri) {
      setSelectedIcon("");
    } else {
      setSelectedIcon(rewardEmojiOptions[0]);
    }
  }, [giftImageUri]);

  const increase = () => {
    setRewardCoins((prev) => prev + 1);
  };

  const decrease = () => {
    setRewardCoins((prev) => Math.max(1, prev - 1));
  };

  const handlePickGiftImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setGiftImageUri(image.uri);
  };

  return (
    <PageView
      containerStyle={styles.pageView}
      background="parent"
      hasBottomPadding
      buttons={[
        {
          title: t("p-dashboard.rewards.saveReward"),
          onPress: () => {},
          disabled: !rewardName.trim() || !rewardCoins,
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

          {/* Set coin prize */}
          <View style={styles.coinWrapper}>
            <ThemedText style={styles.coinText}>{t("p-dashboard.rewards.coinCost")}</ThemedText>
            <ThemedView
              style={[
                styles.stepperWrapper,
                { borderColor: colors.middleGrey },
                globalStyles.shadow,
              ]}
            >
              <Stepper value={rewardCoins} increase={increase} decrease={decrease} />
            </ThemedView>
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
    flex: 1,
  },
  coinWrapper: {
    gap: 10,
    alignItems: "flex-start",
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
