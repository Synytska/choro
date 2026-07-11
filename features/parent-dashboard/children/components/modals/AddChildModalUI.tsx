/**
 * Add-child modal content used by the root add-child-modal route.
 *
 * Props: none. It owns temporary form state, creates the child via useAddChild,
 * then swaps to CreateChildSuccess so the parent can copy the new child login code.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CreateChildSuccess } from "@/components/ui/CreateChildSuccess";
import PageView from "@/components/ui/PageView";
import { TaskCoinReward } from "@/components/ui/TaskCoinReward";
import { TaskList } from "@/components/ui/TaskList";
import { OnboardingTask } from "@/lib/types";
import { genders } from "@/store/features/onboarding/onboardingSlice";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useAddChild } from "../../hooks/useAddChild";
import { ModalForm } from "./ModalForm";

const getDefaultTasks = (tasks: OnboardingTask[]) =>
  tasks.map((task) => ({
    ...task,
    selected: false,
    coins: 1,
  }));

export default function AddChildModalUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const taskOptions = useAppSelector(selectOnboardingTasks);

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");
  const [tasks, setTasks] = useState<OnboardingTask[]>(() => getDefaultTasks(taskOptions));
  const [createdChild, setCreatedChild] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const selectedTasks = tasks.filter((task) => task.selected);

  const addChild = useAddChild();

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

  const handleToggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task,
      ),
    );
  };

  const updateTaskCoinReward = (taskId: string, nextValue: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, coins: Math.max(1, nextValue) } : task,
      ),
    );
  };

  const onDone = () => {
    router.back();
  };

  if (createdChild) {
    return (
      <PageView buttons={[{ title: t("common.done"), onPress: onDone }]}>
        <CreateChildSuccess childName={createdChild.name} childCode={createdChild.code} />
      </PageView>
    );
  }
  return (
    <PageView
      containerStyle={styles.pageView}
      buttons={[
        {
          title: t("p-dashboard.children.addChild"),
          onPress: onSave,
          disabled: !name.trim() || !age || addChild.isPending,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("p-dashboard.children.addChild")}</ThemedText>
          <ThemedText type="subtitle">{t("p-dashboard.children.addModalSubtitle")}</ThemedText>
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
            tasks={tasks}
            onToggleTask={handleToggleTask}
            renderSelectedContent={(task) => (
              <TaskCoinReward
                value={task.coins}
                onIncrease={() => updateTaskCoinReward(task.id, task.coins + 1)}
                onDecrease={() => updateTaskCoinReward(task.id, task.coins - 1)}
              />
            )}
          />
        </ModalForm>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
