/**
 * Inline auth navigation prompt, such as "Already have an account? Sign in".
 *
 * Props:
 * - title: static prompt text.
 * - textLink/onPress: clickable link label and navigation handler.
 */
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";

interface RedirectAuthProps {
  onPress: () => void;
  title: string;
  textLink: string;
}

export function RedirectAuth({ onPress, title, textLink }: RedirectAuthProps) {
  return (
    <View style={styles.signupWrapper}>
      <ThemedText style={styles.signupTitle}>{title}</ThemedText>
      <TouchableOpacity onPress={onPress}>
        <ThemedText style={styles.signupText}>{textLink}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  signupTitle: {
    fontSize: 14,
    color: Palette.darkGrey,
  },
  signupText: {
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: 600,
  },
  signupWrapper: {
    flexDirection: "row",
    gap: 6,
    alignSelf: "center",
  },
});
