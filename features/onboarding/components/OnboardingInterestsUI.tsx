import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { totalOnboardingSteps } from "@/lib/constants";
import { setTaskCoins } from "@/store/features/onboarding/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectChildName, selectOnboardingTasks } from "@/store/selectors";

import { OnboardingWrapper } from "./OnboardingWrapper";
import { styles } from "./styles";

export default function OnboardingInterestsUI() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const childName = useAppSelector(selectChildName);
  const tasks = useAppSelector(selectOnboardingTasks);
  const hasSelectedTasks = tasks.some((task) => task.selected);

  const onNextPress = () => {
    router.push("/(onboarding)/prize");
  };

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    dispatch(setTaskCoins({ id: taskId, coins: nextValue }));
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
        <TaskList
          tasks={tasks}
          showIcon
          renderSelectedContent={(task) => (
            <TaskCoinReward
              value={task.coins}
              onIncrease={() => updateTaskCoinReward(task.id, task.coins + 1)}
              onDecrease={() => updateTaskCoinReward(task.id, task.coins - 1)}
            />
          )}
        />
      </View>
    </OnboardingWrapper>
  );
}
