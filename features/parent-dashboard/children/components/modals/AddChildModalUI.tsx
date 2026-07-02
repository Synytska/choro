/**
 * Add-child modal content used by the root add-child-modal route.
 *
 * Props: none. It owns temporary form state, creates the child via useAddChild,
 * then swaps to CreateChildSuccess so the parent can copy the new child login code.
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CreateChildSuccess } from "@/components/ui/CreateChildSuccess";
import PageView from "@/components/ui/PageView";
import { TaskList } from "@/components/ui/TaskList";
import { genders } from "@/store/features/onboarding/onboardingSlice";
import { useAppSelector } from "@/store/hooks";
import { selectOnboardingTasks } from "@/store/selectors";

import { useAddChild } from "../../hooks/useAddChild";
import { ModalForm } from "./ModalForm";

export default function AddChildModalUI() {
  const { t } = useTranslation();
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
        <CreateChildSuccess childName={createdChild.name} childCode={createdChild.code} />
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
          <TaskList tasks={tasks} />
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
