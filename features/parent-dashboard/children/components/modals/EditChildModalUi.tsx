/**
 * Edit-child modal content used by the root edit-child-modal route.
 *
 * Props:
 * - data: child details loaded by useChildDetails. Used to prefill name, age, gender, and avatar.
 * - isLoading: renders a loading state while data is being fetched.
 * Saves changes through useUpdateChild and closes the modal on submit.
 */
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ModalSkeleton } from "@/components/ui/skeletons/ModalSkeleton";
import { defaultChildAvatarId, modalTop, role } from "@/lib/constants";
import { ChildDetailsData } from "@/lib/types";
import { pickImage } from "@/lib/utils/image-picker";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

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
  const [selectedAvatarId, setSelectedAvatarId] = useState(defaultChildAvatarId);
  const [avatarImageUri, setAvatarImageUri] = useState<string | null>(null);
  const [avatarImageMimeType, setAvatarImageMimeType] = useState<string | null>(null);
  const editChild = useUpdateChild();

  useEffect(() => {
    if (data) {
      setName(data.child.name);
      setAge(String(data.child.age));
      setSelectedGender(data.child.gender);
      setSelectedAvatarId(data.child.avatarId ?? defaultChildAvatarId);
      setAvatarImageUri(data.child.avatarUrl);
      setAvatarImageMimeType(null);
    }
  }, [data]);

  const onEdit = () => {
    if (!data?.child.id) return;

    editChild.mutate(
      {
        id: data.child.id,
        name,
        age: Number(age),
        gender: selectedGender,
        avatarId: selectedAvatarId,
        avatarImageUri,
        avatarImageMimeType,
      },
      {
        onSuccess: () => router.back(),
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

  if (isLoading) {
    return (
      <PageView containerStyle={styles.pageView}>
        <ModalSkeleton />
      </PageView>
    );
  }

  const onBack = () => {
    router.back();
  };

  return (
    <PageView
      modal
      screen={role.parent}
      containerStyle={styles.pageView}
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: onEdit,
        },
        {
          title: t("common.cancel"),
          onPress: onBack,
          variant: "outline",
        },
      ]}
    >
      <CustomScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("parent.children.editChild")}</ThemedText>
          <ThemedText type="subtitle">
            {t("parent.children.editModalSubtitle", { name: name })}
          </ThemedText>
        </View>

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
