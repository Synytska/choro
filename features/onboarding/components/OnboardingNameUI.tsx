import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { SelectablePicker } from "@/components/ui/SelectablePicker";
import { Separator } from "@/components/ui/Separator";
import { usePickAvatar } from "@/hooks/usePickAvatar";
import { childAvatarOptions, totalOnboardingSteps } from "@/lib/constants";
import { updateOnboarding } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOnboarding } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingNameUI() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector(selectOnboarding);

  const {
    selectedAvatarId,
    avatarImageMimeType,
    avatarImageUri,
    onSelectAvatar,
    handlePickAvatarImage,
  } = usePickAvatar({
    initialAvatarId: onboarding.avatarId,
    initialAvatarImageUri: onboarding.avatarImageUri,
    initialAvatarImageMimeType: onboarding.avatarImageMimeType,
  });

  const [childName, setChildName] = useState<string>(onboarding.childName);

  const onNextPress = () => {
    dispatch(
      updateOnboarding({
        childName: childName,
        avatarId: selectedAvatarId,
        avatarImageUri,
        avatarImageMimeType,
      }),
    );
    router.push("/(onboarding)/age");
  };

  return (
    <OnboardingWrapper
      step={1}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
      buttonDisabled={!childName.length}
      dismissKeyboard={true}
    >
      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>{t("onboarding.name.title")}</ThemedText>
          <ThemedText type="subtitle">{t("onboarding.name.subtitle")}</ThemedText>
        </View>

        <Input placeholder={t("common.enterName")} value={childName} onChangeText={setChildName} />
        <View style={styles.pickerWrapper}>
          <SelectablePicker
            title={t("common.pickAvatar")}
            data={childAvatarOptions}
            selectedValue={selectedAvatarId}
            getKey={(item) => item.id}
            onSelect={onSelectAvatar}
            renderOption={(item) => (
              <Image source={item.avatar} style={styles.avatarImage} contentFit="cover" />
            )}
            disabled={!!avatarImageUri}
            clipContent
          />
          <Separator />
          <CustomImagePicker customText="📷" uri={avatarImageUri} onPress={handlePickAvatarImage} />
        </View>
      </View>
    </OnboardingWrapper>
  );
}
