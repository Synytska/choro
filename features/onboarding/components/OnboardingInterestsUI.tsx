import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TaskList } from "@/components/ui/TaskList";
import { totalOnboardingSteps } from "@/lib/constants";
import { useAppSelector } from "@/store/hooks";
import { selectChildName, selectOnboardingTasks } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingInterestsUI() {
  const router = useRouter();
  const { t } = useTranslation();

  const childName = useAppSelector(selectChildName);
  const tasks = useAppSelector(selectOnboardingTasks);
  const hasSelectedTasks = tasks.some((task) => task.selected);

  const onNextPress = () => {
    router.push("/(onboarding)/prize");
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
          <TaskList tasks={tasks} showIcon />
        </ScrollView>
      </View>
    </OnboardingWrapper>
  );
}
