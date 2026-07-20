import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useUpdateTaskStatus } from "@/features/parent-dashboard/tasks/hooks/useUpdateTaskStatus";
import { useAppColors } from "@/hooks/use-app-colors";
import { fullScreenWidth, role, scrollViewTopKid, taskStatus } from "@/lib/constants";
import { TaskItem } from "@/lib/types";
import { takePhoto } from "@/lib/utils/image-picker";
import { selectAuthUserId, selectAuthUserLoginCode } from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

import { PhotoProof } from "./PhotoProof";
import { SectionTitle } from "./SectionTitle";
import { TaskHeader } from "./TaskHeader";

export default function ConfirmTaskUI({ task, color }: { task?: TaskItem; color?: string }) {
  const colors = useAppColors();
  const { t } = useTranslation();
  const router = useRouter();
  const updateTaskStatus = useUpdateTaskStatus();
  const childId = useAppSelector(selectAuthUserId);
  const loginCode = useAppSelector(selectAuthUserLoginCode);
  const [proofPhotoUri, setProofPhotoUri] = useState<string | null>(task?.proofPhotoUrl ?? null);
  const [proofPhotoMimeType, setProofPhotoMimeType] = useState<string | null>(null);

  useEffect(() => {
    setProofPhotoUri(task?.proofPhotoUrl ?? null);
    setProofPhotoMimeType(null);
  }, [task?.proofPhotoUrl]);

  const onPickProofPhoto = async () => {
    const image = await takePhoto();

    if (!image) return;

    setProofPhotoUri(image.uri);
    setProofPhotoMimeType(image.mimeType ?? null);
  };

  const onSubmit = () => {
    if (!task?.id || !childId || !loginCode || !proofPhotoUri || updateTaskStatus.isPending) {
      return;
    }

    updateTaskStatus.mutate(
      {
        childId,
        loginCode,
        taskId: task.id,
        status: taskStatus.review,
        proofPhotoUri,
        proofPhotoMimeType,
      },
      {
        onSuccess: () => router.back(),
      },
    );
  };

  return (
    <PageView
      screen={role.kid}
      buttons={[
        {
          title: t("common.submit"),
          onPress: onSubmit,
          variant: "secondary",
          disabled:
            !task?.id || !childId || !loginCode || !proofPhotoUri || updateTaskStatus.isPending,
        },
      ]}
    >
      <CustomScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <TaskHeader task={task} color={color ?? colors.green} />

        <View style={styles.section}>
          <SectionTitle title={t("kid.home.missionInfo")} color={colors.yellow} />
          <ThemedView child style={styles.descript}>
            <ThemedText child style={[styles.descriptText, { color: colors.white }]}>
              {task?.description}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={styles.section}>
          <SectionTitle title={t("kid.home.photoProof")} />
          <PhotoProof imageUri={proofPhotoUri} onPress={onPickProofPhoto} />
        </View>
      </CustomScrollView>

      <GridOverlay width={fullScreenWidth} />
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 100,
    marginTop: scrollViewTopKid,
  },
  scrollContainer: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  descript: {
    padding: 20,
  },
  descriptText: {
    fontSize: 18,
  },
});
