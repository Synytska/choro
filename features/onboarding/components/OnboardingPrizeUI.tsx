import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Input } from "@/components/ui/Input";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { setPrize, updateOnboarding } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectChildName, selectOnboarding } from "@/store/selectors";

import { useSaveOnboarding } from "../hooks/useSaveOnboarding";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingPrizeUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const saveOnboarding = useSaveOnboarding();

  const onboarding = useAppSelector(selectOnboarding);
  const childName = useAppSelector(selectChildName);

  const [giftName, setGiftName] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [giftImageUri, setGiftImageUri] = useState<string | null>(null);

  const isButtonDisabled = !giftName.length && !coinAmount.length;

  const estimatedDays = useMemo(() => {
    const coins = Number.parseInt(coinAmount, 10);
    return Number.isFinite(coins) && coins > 0 ? Math.max(1, Math.ceil(coins / 45)) : 1;
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
    dispatch(
      setPrize({
        name: giftName,
        coinAmount: coinAmount,
        imageUri: giftImageUri,
      }),
    );
    saveOnboarding.mutate(
      {
        childName: onboarding.childName,
        childAge: onboarding.childAge,
        childGender: onboarding.childGender,
        tasks: onboarding.tasks,
        prize: onboarding.prize,
      },
      {
        onSuccess: (data) => {
          dispatch(
            updateOnboarding({
              childCode: data.child.login_code,
            }),
          );

          router.replace("/(onboarding)/finish");
        },
      },
    );
  };

  return (
    <OnboardingWrapper
      step={4}
      totalSteps={totalOnboardingSteps}
      nextTitle={t("common.save")}
      onNext={onNextPress}
      buttonDisabled={isButtonDisabled}
    >
      <ThemedView style={[styles.content, styles.prizeContent]}>
        <ThemedText style={[styles.title]}>
          {t("onboarding.prize.title", { name: childName })}
        </ThemedText>

        <ThemedView style={{ gap: 20 }}>
          <ThemedView style={styles.field}>
            <ThemedText style={[styles.label]}>{t("onboarding.prize.giftLabel")}</ThemedText>
            <Input
              value={giftName}
              onChangeText={setGiftName}
              placeholder={t("onboarding.prize.giftPlaceholder")}
            />
          </ThemedView>

          <ThemedView style={styles.field}>
            <Text style={[styles.label, { color: colors.darkNavy }]}>
              {t("onboarding.prize.coinsLabel")}
            </Text>
            <Input
              value={coinAmount}
              onChangeText={setCoinAmount}
              keyboardType="number-pad"
              placeholder={t("onboarding.prize.coinsPlaceholder")}
            />
          </ThemedView>

          <ThemedText type="subtitle" style={[styles.estimate]}>
            {t("onboarding.prize.estimate")} {estimatedDays} {estimatedDays === 1 ? "day" : "days"}.
          </ThemedText>
        </ThemedView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={giftImageUri ? "Change gift picture" : "Add gift picture"}
          onPress={handlePickGiftImage}
          style={styles.imagePicker}
        >
          <ThemedView style={[styles.giftIcon, { backgroundColor: colors.lightGrey }]}>
            {giftImageUri ? (
              <Image source={giftImageUri} contentFit="cover" style={styles.giftImage} />
            ) : (
              <Text style={styles.giftEmoji}>🎁</Text>
            )}
          </ThemedView>
          <Text style={[styles.imagePickerText, { color: colors.darkNavy }]}>
            {giftImageUri ? t("onboarding.prize.changePicture") : t("onboarding.prize.addPicture")}
          </Text>
        </Pressable>
      </ThemedView>
    </OnboardingWrapper>
  );
}
