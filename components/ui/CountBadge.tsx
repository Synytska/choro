import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";

export function CountBadge({ title, style }: { title: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.wrapper, style]}>
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
    backgroundColor: Palette.error,
  },
  text: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: 700,
  },
});
