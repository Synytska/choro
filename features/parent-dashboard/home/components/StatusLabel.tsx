import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppColors } from "@/hooks/use-app-colors";
import { taskStatus } from "@/lib/constants";

export function StatusLabel({ status }: { status: string }) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const isDone = status === taskStatus.done;
  const isReview = status === taskStatus.review;

  const dynamicStyles = StyleSheet.create({
    doneBadge: {
      backgroundColor: colors.lightGreen,
    },
    pendingBadge: {
      backgroundColor: colors.lightYellow,
    },
    doneBadgeText: {
      color: colors.darkGreen,
    },
    pendingBadgeText: {
      color: colors.orange,
    },
    reviewBadge: {
      backgroundColor: colors.lightBlue,
    },
    reviewBadgeText: {
      color: colors.blue,
    },
  });

  const statusStyles = isDone
    ? dynamicStyles.doneBadge
    : isReview
      ? dynamicStyles.reviewBadge
      : dynamicStyles.pendingBadge;
  const statusTextStyles = isDone
    ? dynamicStyles.doneBadgeText
    : isReview
      ? dynamicStyles.reviewBadgeText
      : dynamicStyles.pendingBadgeText;
  const statusLabel = isDone
    ? t("common.done")
    : isReview
      ? t("common.review")
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
});
