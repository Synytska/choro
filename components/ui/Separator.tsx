import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";

export function Separator() {
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
      <ThemedText type="subtitle" style={styles.text}>
        {t("common.or")}
      </ThemedText>
      <View style={styles.line} />
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
    backgroundColor: Palette.middleGrey,
  },
  text: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase",
  },
});
