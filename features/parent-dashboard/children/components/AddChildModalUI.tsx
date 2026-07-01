import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { ChildCreateSuccess } from "@/components/ui/ChildCreateSuccess";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { TaskList } from "@/components/ui/TaskList";
import { useAppColors } from "@/hooks/use-app-colors";
import { genders } from "@/store/features/onboarding/onboardingSlice";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useAddChild } from "../hooks/useAddChild";

export default function AddChildModalUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");
  const [createdChild, setCreatedChild] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const tasks = useAppSelector(selectOnboardingTasks);
  const selectedTasks = tasks.filter((task) => task.selected);

  const addChild = useAddChild();

  const dynamicStyles = StyleSheet.create({
    genderOptionText: {
      color: colors.darkNavy,
    },
  });

  const onSave = () => {
    addChild.mutate(
      {
        name,
        age: Number(age),
        gender: selectedGender,
        tasks: selectedTasks,
      },
      {
        onSuccess: (data) => {
          setCreatedChild({
            name: data.child.name,
            code: data.child.login_code,
          });
        },
      },
    );
  };

  const onDone = () => {
    router.back();
  };

  if (createdChild) {
    return (
      <PageView buttons={[{ title: t("common.done"), onPress: onDone }]}>
        <ChildCreateSuccess childName={createdChild.name} childCode={createdChild.code} />
      </PageView>
    );
  }
  return (
    <PageView
      containerStyle={styles.pageView}
      dismissKeyboardOnPress
      buttons={[
        {
          title: t("p-dashboard.children.addChild"),
          onPress: onSave,
          disabled: !name.trim() || !age || addChild.isPending,
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
