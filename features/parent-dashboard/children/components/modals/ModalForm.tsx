/**
 * Shared child form section used by add/edit child modals.
 *
 * Props:
 * - name/age: controlled field values.
 * - onChangeName/onChangeAge: controlled input setters.
 * - selectedGender/onSelectGender: current gender value and radio setter.
 * - children: optional extra content rendered below the avatar picker.
 *
 * This component only renders form fields; submit behavior stays in the parent modal.
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { AvatarPicker } from "@/components/ui/AvatarPicker";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { useAppColors } from "@/hooks/use-app-colors";
import { childAvatarOptions } from "@/lib/constants";
import { ChildGender, genders } from "@/store/features/onboarding/onboardingSlice";

type ModalFormProps = {
  name: string;
  age: string;
  selectedGender: ChildGender;
  children?: ReactNode;
  onChangeName: (value: string) => void;
  onChangeAge: (value: string) => void;
  onSelectGender: (value: ChildGender) => void;
  selectedAvatarId: string;
  onSelectAvatar: (value: string) => void;
  avatarImageUri: string | null;
  onPickAvatarImage: () => void;
};

export function ModalForm({
  name,
  onChangeName,
  age,
  onChangeAge,
  selectedGender,
  onSelectGender,
  children,
  selectedAvatarId,
  onSelectAvatar,
  avatarImageUri,
  onPickAvatarImage,
}: ModalFormProps) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    genderOptionText: {
      color: colors.darkNavy,
    },
  });

  return (
    <View style={styles.form}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.fieldsWrapper}>
          <Input
            label={t("parent.children.childName")}
            placeholder={t("common.enterName")}
            value={name}
            onChangeText={onChangeName}
          />
          <Input
            label={t("common.age")}
            placeholder={t("common.enterAge")}
            value={age}
            onChangeText={onChangeAge}
            keyboardType="number-pad"
          />

          <View style={styles.genderWrapper}>
            <ThemedText style={styles.fieldLabel}>{t("common.gender")}</ThemedText>
            <View style={styles.genderOptions}>
              {genders.map((gender) => {
                const isSelected = selectedGender === gender;

                return (
                  <Pressable
                    key={gender}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => onSelectGender(gender)}
                    style={[styles.genderOption]}
                  >
                    <Text style={[styles.genderOptionText, dynamicStyles.genderOptionText]}>
                      {t(`onboarding.gender.${gender}`)}
                    </Text>
                    <AppIcon
                      icon={isSelected ? Icons.radioOn : Icons.radioOff}
                      color={colors.orange}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.pickerWrapper}>
            <AvatarPicker
              data={childAvatarOptions}
              onPress={onSelectAvatar}
              title={t("common.pickAvatar")}
              selectedAvatarId={selectedAvatarId}
              disabled={!!avatarImageUri}
            />
            <Separator />
            <CustomImagePicker customText="📷" uri={avatarImageUri} onPress={onPickAvatarImage} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {children ? <View style={styles.extraContentWrapper}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    gap: 20,
  },
  fieldsWrapper: {
    gap: 20,
  },
  fieldLabel: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 500,
  },
  extraContentWrapper: {
    flex: 1,
    gap: 4,
    minHeight: 0,
  },
  genderWrapper: {
    gap: 4,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 4,
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  genderOptions: {
    flexDirection: "row",
    gap: 16,
  },
  pickerWrapper: {
    gap: 32,
  },
});
