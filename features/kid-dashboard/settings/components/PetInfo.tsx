import * as Haptics from "expo-haptics";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Badge } from "@/components/ui/Badge";
import { Palette } from "@/constants/theme";

import { actionConfig, petVariants } from "../constants";
import { PetAction, PetVariantId } from "../types";
import { getInitialCareStats, getPetStage } from "../utils";

export function PetInfo({
  safeLevel,
  xpTotal,
  onPress,
  variantId,
  setActiveAction,
  activeAction,
  isCareLocked,
}: {
  safeLevel: number;
  xpTotal: number;
  onPress: (value: PetVariantId) => void;
  variantId: PetVariantId;
  setActiveAction: Dispatch<SetStateAction<PetAction | null>>;
  activeAction: PetAction | null;
  isCareLocked?: boolean;
}) {
  const { t } = useTranslation();

  const [careStats, setCareStats] = useState(() => getInitialCareStats(safeLevel));

  const stage = getPetStage(safeLevel);
  const stageLabel = useMemo(() => t(`kid.settings.pet.stages.${stage}`), [stage, t]);

  const handleCareAction = (action: PetAction) => {
    if (isCareLocked) {
      return;
    }

    const actionItem = actionConfig.find((item) => item.id === action);

    Haptics.impactAsync(
      action === "sleep" ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
    );
    setActiveAction(action);

    if (actionItem) {
      setCareStats((currentStats) => ({
        ...currentStats,
        [actionItem.stat]: Math.min(100, currentStats[actionItem.stat] + actionItem.value),
      }));
    }

    setTimeout(() => {
      setActiveAction((currentAction) => (currentAction === action ? null : currentAction));
    }, 1800);
  };

  return (
    <View style={styles.infoWrapper}>
      <View style={styles.infoRow}>
        <Badge text={stageLabel} color={Palette.green} textStyle={styles.stage} />
        <ThemedText child style={styles.description}>
          {t("kid.settings.pet.description", { xp: xpTotal })}
        </ThemedText>
      </View>

      <View style={styles.variantRow}>
        {petVariants.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              onPress(item.id);
            }}
            style={[
              styles.variantButton,
              { borderColor: item.accentColor },
              variantId === item.id && styles.variantButtonActive,
            ]}
          >
            <View style={[styles.variantSwatch, { backgroundColor: item.color }]} />
            <ThemedText child style={styles.variantLabel}>
              {t(`kid.settings.pet.variants.${item.id}`)}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.statsGrid}>
        {Object.entries(careStats).map(([key, value]) => (
          <View key={key} style={[styles.statItem, isCareLocked && styles.disabledCareItem]}>
            <View style={styles.statTrack}>
              <View
                style={[
                  styles.statFill,
                  { width: `${value}%` },
                  isCareLocked && styles.disabledStatFill,
                ]}
              />
            </View>
            <ThemedText style={styles.statLabel}>
              {t(`kid.settings.pet.stats.${key}`)} {value}%
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.actionRow}>
        {actionConfig.map((action) => (
          <Pressable
            key={action.id}
            accessibilityState={{ disabled: isCareLocked }}
            disabled={isCareLocked}
            onPress={() => handleCareAction(action.id)}
            style={[
              styles.actionButton,
              activeAction === action.id && styles.actionButtonActive,
              isCareLocked && styles.actionButtonDisabled,
            ]}
          >
            <ThemedText style={[styles.actionIcon, isCareLocked && styles.disabledActionText]}>
              {action.icon}
            </ThemedText>
            <ThemedText
              child
              style={[styles.actionLabel, isCareLocked && styles.disabledActionText]}
            >
              {t(`kid.settings.pet.actions.${action.id}`)}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 16,
  },
  infoRow: {
    gap: 8,
  },
  stage: {
    color: Palette.white,
    fontSize: 16,
  },
  description: {
    color: Palette.middleGrey,
    fontSize: 18,
    lineHeight: 18,
  },
  variantRow: {
    flexDirection: "row",
    gap: 8,
  },
  variantButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: Palette.darkNavy,
  },
  variantButtonActive: {
    backgroundColor: Palette.borderBlue,
  },
  variantSwatch: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  variantLabel: {
    color: Palette.white,
    fontSize: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  statItem: {
    width: "47%",
    gap: 5,
  },
  disabledCareItem: {
    opacity: 0.45,
  },
  statTrack: {
    height: 7,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: Palette.borderBlue,
  },
  statFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: Palette.green,
  },
  disabledStatFill: {
    backgroundColor: Palette.middleGrey,
  },
  statLabel: {
    color: Palette.middleGrey,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: Palette.darkBlue,
    borderRadius: 16,
    backgroundColor: Palette.borderBlue,
  },
  actionButtonActive: {
    borderColor: Palette.green,
    backgroundColor: Palette.progressGreen,
  },
  actionButtonDisabled: {
    opacity: 0.45,
    borderColor: Palette.borderBlue,
    backgroundColor: Palette.darkNavy,
  },
  actionIcon: {
    fontSize: 20,
  },
  disabledActionText: {
    color: Palette.middleGrey,
  },
  actionLabel: {
    color: Palette.white,
    fontSize: 14,
  },
});
