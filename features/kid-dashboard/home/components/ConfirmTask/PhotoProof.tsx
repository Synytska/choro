import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

export function PhotoProof() {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <ThemedView child style={[styles.photoProof, { borderColor: colors.green }]}>
      <AppIcon icon={Icons.camera} size={48} color={colors.green} />

      <View style={styles.photoProofText}>
        <ThemedText child style={[styles.addPhoto, { color: colors.green }]}>
          {t("kid.home.tapToAdd")}
        </ThemedText>
        <ThemedText type="subtitle">{t("kid.home.takePhotoSubtl")}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  photoProof: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderStyle: "dashed",
    gap: 12,
  },
  photoProofText: {
    alignItems: "center",
    gap: 4,
  },
  addPhoto: {
    fontSize: 24,
    textTransform: "uppercase",
    lineHeight: 26,
  },
});
