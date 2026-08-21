import "@/lib/threeNativeWarnings";

import * as Haptics from "expo-haptics";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Badge } from "@/components/ui/Badge";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";

import { petVariants } from "../constants";
import { PetAction, PetHatchCardProps, PetVariantId } from "../types";
import { PetHatchScene } from "./3DPet/PetHatchScene";
import { PetInfo } from "./PetInfo";

export function PetHatchCard({ level = 1, petName, xpTotal = 0 }: PetHatchCardProps) {
  const { t } = useTranslation();
  const safeLevel = Math.max(1, Math.floor(level));
  const [activeAction, setActiveAction] = useState<PetAction | null>(null);
  const [variantId, setVariantId] = useState<PetVariantId>("nova");
  const variant = petVariants.find((item) => item.id === variantId) ?? petVariants[0];

  const displayName = petName
    ? t("kid.settings.pet.namedTitle", { name: petName })
    : t("kid.settings.pet.title");

  const onVariantPress = (id: PetVariantId) => {
    Haptics.selectionAsync();
    setVariantId(id);
  };

  return (
    <View style={[styles.card, globalStyles.kidShadow]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText child style={styles.eyebrow}>
            {t("kid.settings.pet.eyebrow")}
          </ThemedText>
          <ThemedText child style={styles.title}>
            {displayName}
          </ThemedText>
        </View>

        <Badge
          text={t("kid.settings.pet.level", { level: safeLevel })}
          color={Palette.green}
          textStyle={styles.levelText}
        />
      </View>

      <View style={styles.sceneWrap}>
        <PetHatchScene action={activeAction} level={safeLevel} variant={variant} />
      </View>

      <PetInfo
        variantId={variantId}
        safeLevel={safeLevel}
        xpTotal={xpTotal}
        onPress={onVariantPress}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Palette.borderBlue,
    borderRadius: 24,
    backgroundColor: Palette.darkNavy,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: Palette.green,
    fontSize: 18,
    textTransform: "uppercase",
  },
  title: {
    color: Palette.white,
    fontSize: 32,
    lineHeight: 34,
  },
  sceneWrap: {
    height: 300,
    marginTop: 8,
    backgroundColor: Palette.darkNavy,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 16,
  },
});
