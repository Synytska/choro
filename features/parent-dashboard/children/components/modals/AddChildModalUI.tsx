/**
 * Add-child modal content used by the root add-child-modal route.
 *
 * Props: none. It owns temporary form state, creates the child via useAddChild,
 * then swaps to CreateChildSuccess so the parent can copy the new child login code.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CreateChildSuccess } from "@/components/ui/CreateChildSuccess";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { usePickAvatar } from "@/hooks/usePickAvatar";
import { genders } from "@/store/features/onboarding/onboardingSlice";

import { checkChildNameExists } from "../../api/children.api";
import { useAddChild } from "../../hooks/useAddChild";
import { AddChildFormData, addChildSchema } from "../../schemas/addChildSchema";
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

  const {
    control,
    formState: { errors },
    handleSubmit,
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
  const [selectedGender, setSelectedGender] = useState<(typeof genders)[number]>("boy");
  const [createdChild, setCreatedChild] = useState<{
    id: string;
    name: string;
    code: string;
  } | null>(null);

  const name = watch("name");
  const age = watch("age");

  const onSave = async (data: AddChildFormData) => {
    setIsCheckingName(true);

    try {
      if (await checkChildNameExists(data.name)) {
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

    addChild.mutate(
      {
        name: data.name,
        age: Number(data.age),
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
    if (!createdChild?.id) return;

    router.replace({
      pathname: "/(role-parent)/tasks",
      params: { childId: createdChild.id },
    });
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
          onPress: handleSubmit(onSave),
          disabled: !name.trim() || !age || addChild.isPending || isCheckingName,
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
  pageView: {
    gap: 20,
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
