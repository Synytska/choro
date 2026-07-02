/**
 * Shared child form section used by add/edit child modals.
 *
 * Props:
 * - name/age: controlled field values.
 * - onChangeName/onChangeAge: controlled input setters.
 * - selectedGender/onSelectGender: current gender value and radio setter.
 * - children: task selector content rendered below the gender controls.
 *
 * This component only renders form fields; submit behavior stays in the parent modal.
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Input } from "@/components/ui/Input";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildGender, genders } from "@/store/features/onboarding/onboardingSlice";

type ModalFormType = {
  name: string;
  age: string;
  selectedGender: string;
  children: ReactNode;
  onChangeName: (value: string) => void;
  onChangeAge: (value: string) => void;
  onSelectGender: (value: ChildGender) => void;
};

export function ModalForm({
  name,
  onChangeName,
  age,
  onChangeAge,
  selectedGender,
  onSelectGender,
  children,
}: ModalFormType) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    genderOptionText: {
      color: colors.darkNavy,
    },
  });

  return (
    <View style={styles.form}>
      <Input
        label={t("p-dashboard.children.childName")}
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
        <ThemedText style={styles.tasks}>{t("common.gender")}</ThemedText>
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
                <AppIcon icon={isSelected ? Icons.radioOn : Icons.radioOff} />
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.tasksWrapper}>
        <ThemedText style={styles.tasks}>{t("common.tasks")}</ThemedText>
        <View style={[styles.taskList]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  taskList: {
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tasks: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 500,
  },
  tasksWrapper: {
    gap: 4,
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
});
