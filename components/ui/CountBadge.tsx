import { StyleSheet, View } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";

export function CountBadge({ title }: { title: number }) {
  return (
    <View style={[styles.wrapper, { backgroundColor: Palette.error }]}>
      <ThemedText style={[styles.text, { color: Palette.white }]}>{title}</ThemedText>
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
