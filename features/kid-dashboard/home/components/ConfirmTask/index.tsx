import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useAppColors } from "@/hooks/use-app-colors";
import { fullScreenWidth, role, scrollViewTopKid } from "@/lib/constants";
import { TaskItem } from "@/lib/types";

import { PhotoProof } from "./PhotoProof";
import { SectionTitle } from "./SectionTitle";
import { TaskHeader } from "./TaskHeader";

export default function ConfirmTaskUI({ task, color }: { task?: TaskItem; color?: string }) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <PageView
      screen={role.kid}
      buttons={[{ title: t("common.submit"), onPress: () => {}, variant: "secondary" }]}
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
          <PhotoProof />
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
