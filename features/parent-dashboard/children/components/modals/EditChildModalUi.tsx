/**
 * Edit-child modal content used by the root edit-child-modal route.
 *
 * Props:
 * - data: child details loaded by useChildDetails. Used to prefill name, age, gender, and avatar.
 * - isLoading: renders a loading state while data is being fetched.
 * Saves changes through useUpdateChild and closes the modal on submit.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { ModalSkeleton } from "@/components/ui/skeletons/ModalSkeleton";
import { defaultChildAvatarId, role } from "@/lib/constants";
import { ChildDetailsData } from "@/lib/types";
import { pickImage } from "@/lib/utils/image-picker";
import { ChildGender } from "@/store/features/onboarding/onboardingSlice";

import { checkChildNameExists } from "../../api/children.api";
import { useUpdateChild } from "../../hooks/useUpdateChild";
import { AddChildFormData, addChildSchema } from "../../schemas/addChildSchema";
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

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    watch,
  } = useForm<AddChildFormData>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      name: "",
      age: "",
    },
  });
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [selectedGender, setSelectedGender] = useState<ChildGender>("boy");
  const [selectedAvatarId, setSelectedAvatarId] = useState(defaultChildAvatarId);
  const [avatarImageUri, setAvatarImageUri] = useState<string | null>(null);
  const [avatarImageMimeType, setAvatarImageMimeType] = useState<string | null>(null);
  const editChild = useUpdateChild();
  const name = watch("name");

  useEffect(() => {
    if (data) {
      reset({
        name: data.child.name,
        age: String(data.child.age),
      });
      setSelectedGender(data.child.gender);
      setSelectedAvatarId(data.child.avatarId ?? defaultChildAvatarId);
      setAvatarImageUri(data.child.avatarUrl);
      setAvatarImageMimeType(null);
    }
  }, [data, reset]);

  const onEdit = async (formData: AddChildFormData) => {
    if (!data?.child.id) return;

    setIsCheckingName(true);

    try {
      if (await checkChildNameExists(formData.name, data.child.id)) {
        setError("name", {
          type: "validate",
          message: t("parent.children.childNameExists"),
        });

        return;
      }
    } catch {
      // The API validates the name again during the mutation and will show the fallback toast.
    } finally {
      setIsCheckingName(false);
    }

    editChild.mutate(
      {
        id: data.child.id,
        name: formData.name,
        age: Number(formData.age),
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
      <PageView modal>
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
      buttons={[
        {
          title: t("common.saveChanges"),
          onPress: handleSubmit(onEdit),
          disabled: editChild.isPending || isCheckingName,
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
          control={control}
          errors={errors}
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
    gap: 24,
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
