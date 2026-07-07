import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";
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

  const trimmedGiftName = giftName.trim();

  const isButtonDisabled = !trimmedGiftName.length || !coinAmount.length;

  const estimatedDays = useMemo(() => {
    const coins = Number.parseInt(coinAmount, 10);
    return Number.isFinite(coins) && coins > 0 ? Math.max(1, Math.ceil(coins / 45)) : 1;
  }, [coinAmount]);

  const handlePickGiftImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setGiftImageUri(image.uri);
  };

  const onNextPress = () => {
    const nextPrize = {
      name: trimmedGiftName,
      coinAmount: coinAmount,
      imageUri: giftImageUri,
    };

    dispatch(setPrize(nextPrize));

    saveOnboarding.mutate(
      {
        childName: onboarding.childName,
        childAge: onboarding.childAge,
        childGender: onboarding.childGender,
        tasks: onboarding.tasks,
        prize: nextPrize,
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
      dismissKeyboard={true}
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

        <CustomImagePicker uri={giftImageUri} onPress={handlePickGiftImage} />
      </ThemedView>
    </OnboardingWrapper>
  );
}
