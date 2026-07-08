import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";

export function Separator() {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.line, { backgroundColor: colors.middleGrey }]} />
      <ThemedText type="subtitle" style={styles.text}>
        {t("common.or")}
      </ThemedText>
      <View style={[styles.line, { backgroundColor: colors.middleGrey }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  line: {
    height: 1,
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase",
  },
});
