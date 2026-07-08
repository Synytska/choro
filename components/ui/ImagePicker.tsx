import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type ImagePicker = {
  uri: string | null;
  onPress: () => void;
};

export function CustomImagePicker({ uri, onPress }: ImagePicker) {
  const { t } = useTranslation();
  const colors = useAppColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        uri ? t("onboarding.prize.changePicture") : t("onboarding.prize.addPicture")
      }
      onPress={onPress}
      style={styles.imagePicker}
      hitSlop={8}
    >
      <ThemedView style={[styles.giftIcon, { backgroundColor: colors.lightGrey }]}>
        {uri ? (
          <Image source={uri} contentFit="cover" style={styles.giftImage} />
        ) : (
          <Text style={styles.giftEmoji}>🎁</Text>
        )}
      </ThemedView>
      <ThemedText style={[styles.imagePickerText, { color: colors.darkNavy }]}>
        {uri ? t("onboarding.prize.changePicture") : t("onboarding.prize.addPicture")}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
  },
  giftIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  giftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  giftEmoji: {
    fontSize: 48,
  },
  imagePickerText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
  },
});
