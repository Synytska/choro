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
import { CustomScrollView } from "@/components/ui/ScrollView";
import { usePickAvatar } from "@/hooks/usePickAvatar";
import { modalTop } from "@/lib/constants";
import { genders } from "@/store/features/onboarding/onboardingSlice";

import { useAddChild } from "../../hooks/useAddChild";
import { ModalForm } from "./ModalForm";

export default function AddChildModalUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const addChild = useAddChild();
  const {
    selectedAvatarId,
    avatarImageMimeType,
    avatarImageUri,
    onSelectAvatar,
    handlePickAvatarImage,
  } = usePickAvatar();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");
  const [createdChild, setCreatedChild] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);

  const onSave = () => {
    addChild.mutate(
      {
        name,
        age: Number(age),
        gender: selectedGender,
        avatarId: selectedAvatarId,
        avatarImageUri,
        avatarImageMimeType,
      },
      {
        onSuccess: (data) => {
          setCreatedChild({
            id: data.child.id,
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

  const onAddTask = () => {
    router.replace("/(role-parent)/tasks");
  };

  if (createdChild) {
    return (
      <PageView
        modal
        containerStyle={styles.pageView}
        buttons={[
          { title: t("parent.children.addTasks"), onPress: onAddTask },
          { title: t("common.done"), onPress: onDone, variant: "outline" },
        ]}
      >
        <CreateChildSuccess childName={createdChild.name} childCode={createdChild.code} />
      </PageView>
    );
  }
  return (
    <PageView
      modal
      containerStyle={styles.pageView}
      buttons={[
        {
          title: t("parent.children.addChild"),
          onPress: onSave,
          disabled: !name.trim() || !age || addChild.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: onDone,
          variant: "outline",
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>{t("parent.children.addChild")}</ThemedText>
        <ThemedText type="subtitle">{t("parent.children.addModalSubtitle")}</ThemedText>
      </View>

      <CustomScrollView contentContainerStyle={styles.container}>
        <ModalForm
          name={name}
          onChangeName={setName}
          age={age}
          onChangeAge={setAge}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          selectedAvatarId={selectedAvatarId}
          onSelectAvatar={onSelectAvatar}
          avatarImageUri={avatarImageUri}
          onPickAvatarImage={handlePickAvatarImage}
        />
      </CustomScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  pageView: {
    paddingTop: modalTop,
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
