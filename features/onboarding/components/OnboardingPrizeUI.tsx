import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { useAppColors } from "@/hooks/use-app-colors";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import { styles } from "./styles";
import { totalOnboardingSteps } from "@/lib/constants";

export default function OnboardingPrizeUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const [giftName, setGiftName] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);

  const estimatedDays = useMemo(() => {
    const coins = Number.parseInt(coinAmount, 10);
    return Number.isFinite(coins) && coins > 0
      ? Math.max(1, Math.ceil(coins / 45))
      : 1;
  }, [coinAmount]);

  const handlePickGiftImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Allow access to your photos to add a picture for this gift.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setGiftImageUri(result.assets[0].uri);
    }
  };

  const onNextPress = () => {
    router.push("/(onboarding)/finish");
  };

  return (
    <OnboardingWrapper
      step={4}
      totalSteps={totalOnboardingSteps}
      nextTitle={t("save")}
      onNext={onNextPress}
    >
      <View style={[styles.content, styles.prizeContent]}>
        <ThemedText style={[styles.title]}>{t("createPrize")}</ThemedText>

        <View style={{ gap: 20 }}>
          <View style={styles.field}>
            <ThemedText style={[styles.label]}>
              {t("createPrizeInputLabel1")}
            </ThemedText>
            <Input
              value={giftName}
              onChangeText={setGiftName}
              placeholder={t("createPrizeInputPlaceholder1")}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.darkNavy }]}>
              {t("createPrizeInputLabel2")}
            </Text>
            <Input
              value={coinAmount}
              onChangeText={setCoinAmount}
              keyboardType="number-pad"
              placeholder={t("createPrizeInputPlaceholder2")}
            />
          </View>

          <ThemedText type="subtitle" style={[styles.estimate]}>
            {t("recievePrizeExplain")} {estimatedDays}{" "}
            {estimatedDays === 1 ? "day" : "days"}.
          </ThemedText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            giftImageUri ? "Change gift picture" : "Add gift picture"
          }
          onPress={handlePickGiftImage}
          style={styles.imagePicker}
        >
          <View
            style={[styles.giftIcon, { backgroundColor: colors.lightGrey }]}
          >
            {giftImageUri ? (
              <Image
                source={giftImageUri}
                contentFit="cover"
                style={styles.giftImage}
              />
            ) : (
              <Text style={styles.giftEmoji}>🎁</Text>
            )}
          </View>
          <Text style={[styles.imagePickerText, { color: colors.darkNavy }]}>
            {giftImageUri ? "Change gift picture" : t("addGiftPict")}
          </Text>
        </Pressable>
      </View>
    </OnboardingWrapper>
  );
}
