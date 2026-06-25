import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { OnboardingWrapper } from "./OnboardingWrapper";
import { useAppColors } from "@/hooks/use-app-colors";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/themed-text";
import { styles } from "./styles";
import { totalOnboardingSteps } from "@/lib/constants";

const tasks = [
  { id: "toys", emoji: "🧸", label: "Arrange the toys" },
  { id: "bed", emoji: "🛏️", label: "Make the bed" },
  { id: "teeth", emoji: "🪥", label: "Brush your teeth" },
  { id: "table", emoji: "🍽️", label: "Serve a table" },
  { id: "dishes", emoji: "🧽", label: "Wash the dishes" },
  { id: "trash", emoji: "🗑️", label: "Take out the trash" },
  { id: "room", emoji: "🧹", label: "Clean the room" },
  { id: "flowers", emoji: "🌻", label: "Water the flowers" },
];

export default function OnboardingInterestsUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const onNextPress = () => {
    router.push("/(onboarding)/prize");
  };

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId],
    );
  };

  return (
    <OnboardingWrapper
      step={3}
      totalSteps={totalOnboardingSteps}
      onNext={onNextPress}
      nextTitle={t("save")}
    >
      <View style={[styles.content, styles.prizeContent]}>
        <View style={styles.titleGroup}>
          <ThemedText style={styles.title}>{t("chooseTask")}</ThemedText>
          <ThemedText type="subtitle">{t("chooseTaskExplain")}</ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.taskList}>
          {tasks.map((task) => {
            const isSelected = selectedTaskIds.includes(task.id);

            return (
              <Pressable
                key={task.id}
                accessibilityRole="checkbox"
                accessibilityLabel={task.label}
                accessibilityState={{ checked: isSelected }}
                onPress={() => toggleTask(task.id)}
                style={[styles.task, { backgroundColor: colors.lightGrey }]}
              >
                <View style={styles.taskDetails}>
                  <Text style={styles.taskEmoji}>{task.emoji}</Text>
                  <Text style={[styles.taskLabel, { color: colors.darkNavy }]}>
                    {task.label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected
                        ? colors.darkNavy
                        : colors.middleGrey,
                      backgroundColor: isSelected
                        ? colors.darkNavy
                        : colors.white,
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
