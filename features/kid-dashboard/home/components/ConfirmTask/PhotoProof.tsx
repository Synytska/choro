import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

export function PhotoProof({
  imageUri,
  onPress,
}: {
  imageUri?: string | null;
  onPress: () => void;
}) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <ThemedView child style={[styles.photoProof, { borderColor: colors.green }]}>
        {imageUri ? (
          <Image source={imageUri} style={styles.preview} contentFit="cover" />
        ) : (
          <AppIcon icon={Icons.camera} size={48} color={colors.green} />
        )}

        <View style={styles.photoProofText}>
          <ThemedText child style={[styles.addPhoto, { color: colors.green }]}>
            {imageUri ? t("kid.home.changePhoto") : t("kid.home.tapToAdd")}
          </ThemedText>
          <ThemedText type="subtitle">
            {imageUri ? t("kid.home.photoAdded") : t("kid.home.takePhotoSubtl")}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
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
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 18,
  },
});
