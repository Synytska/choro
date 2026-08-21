import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { taskStatus } from "@/lib/constants";

export function StatusLabel({ status }: { status: string }) {
  const { t } = useTranslation();

  const isDone = status === taskStatus.done;
  const isReview = status === taskStatus.review;

  const statusStyles = isDone
    ? styles.doneBadge
    : isReview
      ? styles.reviewBadge
      : styles.pendingBadge;
  const statusTextStyles = isDone
    ? styles.doneBadgeText
    : isReview
      ? styles.reviewBadgeText
      : styles.pendingBadgeText;
  const statusLabel = isDone
    ? t("common.done")
    : isReview
      ? t("common.approve")
      : t("common.pending");

  return (
    <View style={[styles.statusBadge, statusStyles]}>
      <ThemedText style={[styles.statusText, statusTextStyles]}>{statusLabel}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  doneBadge: {
    backgroundColor: Palette.progressGreen,
  },
  pendingBadge: {
    backgroundColor: Palette.lightYellow,
  },
  doneBadgeText: {
    color: Palette.darkGreen,
  },
  pendingBadgeText: {
    color: Palette.orange,
  },
  reviewBadge: {
    backgroundColor: Palette.darkGreen,
  },
  reviewBadgeText: {
    color: Palette.white,
  },
});
