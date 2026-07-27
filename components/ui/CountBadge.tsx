import { StyleSheet, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";

export function CountBadge({ title }: { title: number }) {
  const colors = useAppColors();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.error }]}>
      <ThemedText style={[styles.text, { color: colors.white }]}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: 20,
    height: 20,
    right: -4,
    top: -2,
    zIndex: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: 700,
  },
});
