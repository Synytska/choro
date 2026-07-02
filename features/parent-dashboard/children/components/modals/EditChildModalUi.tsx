/**
 * Edit-child modal content used by the root edit-child-modal route.
 *
 * Props:
 * - data: child details loaded by useChildDetails. Used to prefill name, age, gender, and tasks.
 * - isLoading: renders a loading state while data is being fetched.
 * Saves changes through useUpdateChild and closes the modal on submit.
 */
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import PageView from "@/components/ui/PageView";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { ChildDetailsData, OnboardingTask } from "@/lib/types";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useUpdateChild } from "../../hooks/useUpdateChild";
import { ModalForm } from "./ModalForm";

export function EditChildModal({
  data,
  isLoading,
}: {
  data?: ChildDetailsData | null;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<ChildGender>("boy");
  const [editableTasks, setEditableTasks] = useState<OnboardingTask[]>([]);
  const [taskCoinRewards, setTaskCoinRewards] = useState<Record<string, number>>({});

  const taskOptions = useAppSelector(selectOnboardingTasks);
  const editChild = useUpdateChild();

  useEffect(() => {
    if (data) {
      setName(data.child.name);
      setAge(String(data.child.age));
      setSelectedGender(data.child.gender);

      const selectedTaskTitles = new Set(data.tasks.map((task) => task.title));

      setEditableTasks(
        taskOptions.map((task) => ({
          ...task,
          selected: selectedTaskTitles.has(task.title),
        })),
      );
      setTaskCoinRewards(
        taskOptions.reduce<Record<string, number>>((rewards, task) => {
          rewards[task.id] = 1;
          return rewards;
        }, {}),
      );
    }
  }, [data, taskOptions]);

  const handleToggleTask = (taskId: string) => {
    setEditableTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task,
      ),
    );
  };

  const getTaskCoinReward = (taskId: string) => taskCoinRewards[taskId] ?? 1;

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    setTaskCoinRewards((currentRewards) => ({
      ...currentRewards,
      [taskId]: Math.max(1, nextValue),
    }));
  };

  const onEdit = () => {
    if (!data?.child.id) return;

    editChild.mutate({
      id: data?.child.id,
      name,
      age: Number(age),
      gender: selectedGender,
      tasks: editableTasks,
    });
    router.back();
  };

  if (isLoading) {
    return (
      <PageView containerStyle={styles.pageView}>
        <Text>Loading...</Text>
      </PageView>
    );
  }

  return (
    <PageView
      containerStyle={styles.pageView}
      dismissKeyboardOnPress
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: onEdit,
        },
      ]}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("p-dashboard.children.editChild")}</ThemedText>
          <ThemedText type="subtitle">
            {t("p-dashboard.children.editModalSubtitle", { name: name })}
          </ThemedText>
        </View>

        <ModalForm
          name={name}
          onChangeName={setName}
          age={age}
          onChangeAge={setAge}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
        >
          <TaskList
            tasks={editableTasks}
            onToggleTask={handleToggleTask}
            renderSelectedContent={(task) => (
              <TaskCoinReward
                value={getTaskCoinReward(task.id)}
                onIncrease={() => updateTaskCoinReward(task.id, getTaskCoinReward(task.id) + 1)}
                onDecrease={() => updateTaskCoinReward(task.id, getTaskCoinReward(task.id) - 1)}
              />
            )}
          />
        </ModalForm>
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
});
