import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { TaskList } from "@/components/ui/TaskList";
import { useSaveOnboarding } from "@/features/onboarding/hooks/useSaveOnboarding";
import { useAppColors } from "@/hooks/use-app-colors";
import {
  ChildGender,
  genders,
  updateOnboarding,
} from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

export default function AddChildModalUI() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const colors = useAppColors();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("0");
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");

  const tasks = useAppSelector(selectOnboardingTasks);
  const selectedTasks = tasks.filter((task) => task.selected);

  const saveOnboarding = useSaveOnboarding();

  const dynamicStyles = StyleSheet.create({
    selectedGenderOption: {
      borderColor: colors.darkNavy,
      backgroundColor: colors.darkNavy,
    },
    genderOptionText: {
      color: colors.darkNavy,
    },
    selectedGenderOptionText: {
      color: colors.white,
    },
  });

  const onSave = () => {
    // TODO: connect this to Supabase once the add-child mutation is ready.
    // saveOnboarding.mutate(
    //   {
    //     childName: name,
    //     childAge: Number(age),
    //     // childGender: selectedGender,
    //     tasks: selectedTasks,
    //     // prize: null,
    //   },
    //   {
    //     onSuccess: (data) => {
    //       dispatch(
    //         updateOnboarding({
    //           childCode: data.child.login_code,
    //         }),
    //       );
    //     },
    //   },
    // );
    router.back();
  };

  return (
    <PageView
      containerStyle={styles.pageView}
      dismissKeyboardOnPress
      buttons={[
        {
          title: t("p-dashboard.children.addChild"),
          onPress: onSave,
          disabled: !name.trim() || !age,
        },
      ]}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("p-dashboard.children.addChild")}</ThemedText>
          <ThemedText type="subtitle">{t("p-dashboard.children.modalSubtitle")}</ThemedText>
        </View>

        <View style={styles.form}>
          <Input
            label={t("p-dashboard.children.childName")}
            placeholder={t("common.enterName")}
            value={name}
            onChangeText={setName}
          />
          <Input
            label={t("common.age")}
            placeholder={t("common.enterAge")}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />

          <View style={{ gap: 4 }}>
            <ThemedText style={styles.tasks}>{t("common.gender")}</ThemedText>
            <View style={styles.genderOptions}>
              {genders.map((gender) => {
                const isSelected = selectedGender === gender;

                return (
                  <Pressable
                    key={gender}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedGender(gender)}
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
            <View style={[styles.taskList]}>
              <TaskList tasks={tasks} />
            </View>
          </View>
        </View>
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  pageView: {
    paddingTop: 24,
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
  closeText: {
    fontSize: 15,
    fontWeight: "700",
  },
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
