import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppColors } from "@/hooks/use-app-colors";
import { totalOnboardingSteps } from "@/lib/constants";
import { toggleTask } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectChildName, selectOnboardingTasks } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingInterestsUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const childName = useAppSelector(selectChildName);
  const tasks = useAppSelector(selectOnboardingTasks);
  const hasSelectedTasks = tasks.some((task) => task.selected);

  const onNextPress = () => {
    router.push("/(onboarding)/prize");
  };

  const handleToggleTask = (taskId: string) => {
    dispatch(toggleTask(taskId));
  };

  return (
    <OnboardingWrapper
      step={3}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
      nextTitle={t("common.save")}
      buttonDisabled={!hasSelectedTasks}
    >
      <View style={[styles.content, styles.prizeContent]}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>
            {t("onboarding.tasks.title", { name: childName })}
          </ThemedText>
          <ThemedText type="subtitle">{t("onboarding.tasks.subtitle")}</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.taskList}>
          {tasks.map((task) => {
            const isSelected = task.selected;

            return (
              <Pressable
                key={task.id}
                accessibilityRole="checkbox"
                accessibilityLabel={task.title}
                accessibilityState={{ checked: isSelected }}
                onPress={() => handleToggleTask(task.id)}
                style={[styles.task, { backgroundColor: colors.lightGrey }]}
              >
                <View style={styles.taskDetails}>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <Text style={[styles.taskLabel, { color: colors.darkNavy }]}>{task.title}</Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.darkNavy : colors.middleGrey,
                      backgroundColor: isSelected ? colors.darkNavy : colors.white,
                    },
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </OnboardingWrapper>
  );
}
