import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconPicker } from "@/components/ui/IconPicker";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Separator } from "@/components/ui/Separator";
import { rewardEmojiOptions } from "@/lib/constants";

type RewardFormFieldsProps = {
  title: string;
  subtitle: string;
  rewardName: string;
  onChangeRewardName: (value: string) => void;
  rewardCoins: string;
  onChangeRewardCoins: (value: string) => void;
  rewardNameLabel: string;
  rewardNamePlaceholder: string;
  coinCostLabel: string;
  coinPlaceholder: string;
  pickIconLabel: string;
  selectedIcon: string;
  onSelectIcon: (value: string) => void;
  iconDisabled?: boolean;
  giftImageUri: string | null;
  onPickGiftImage: () => void;
  children?: ReactNode;
};

export function RewardFormFields({
  title,
  subtitle,
  rewardName,
  onChangeRewardName,
  rewardCoins,
  onChangeRewardCoins,
  rewardNameLabel,
  rewardNamePlaceholder,
  coinCostLabel,
  coinPlaceholder,
  pickIconLabel,
  selectedIcon,
  onSelectIcon,
  iconDisabled,
  giftImageUri,
  onPickGiftImage,
  children,
}: RewardFormFieldsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText type="subtitle">{subtitle}</ThemedText>
      </View>

      <CustomScrollView contentContainerStyle={styles.fieldsWrapper}>
        <Input
          label={rewardNameLabel}
          placeholder={rewardNamePlaceholder}
          value={rewardName}
          onChangeText={onChangeRewardName}
        />

        {children}

        <View style={styles.coinWrapper}>
          <ThemedText style={styles.coinText}>{coinCostLabel}</ThemedText>
          <Input
            value={rewardCoins}
            onChangeText={onChangeRewardCoins}
            keyboardType="number-pad"
            placeholder={coinPlaceholder}
          />
        </View>

        <View style={styles.pickerWrapper}>
          <IconPicker
            data={rewardEmojiOptions}
            onPress={onSelectIcon}
            title={pickIconLabel}
            selectedIcon={selectedIcon}
            disabled={iconDisabled}
          />
          <Separator />
          <CustomImagePicker customText="🎁" uri={giftImageUri} onPress={onPickGiftImage} />
        </View>
      </CustomScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
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
