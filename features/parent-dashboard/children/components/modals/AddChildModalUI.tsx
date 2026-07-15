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
import { defaultChildAvatarId, modalTop } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";
import { genders } from "@/store/features/onboarding/onboardingSlice";

import { useAddChild } from "../../hooks/useAddChild";
import { ModalForm } from "./ModalForm";

export default function AddChildModalUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const addChild = useAddChild();

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");
  const [selectedAvatarId, setSelectedAvatarId] = useState(defaultChildAvatarId);
  const [avatarImageUri, setAvatarImageUri] = useState<string | null>(null);
  const [avatarImageMimeType, setAvatarImageMimeType] = useState<string | null>(null);
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

  const onSelectAvatar = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setAvatarImageUri(null);
    setAvatarImageMimeType(null);
  };

  const handlePickAvatarImage = async () => {
    const image = await pickImage();

    if (!image) return;

    setAvatarImageUri(image.uri);
    setAvatarImageMimeType(image.mimeType ?? null);
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
