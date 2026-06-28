import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";

interface RedirectAuthProps {
  onPress: () => void;
  title: string;
  textLink: string;
}

export function RedirectAuth({ onPress, title, textLink }: RedirectAuthProps) {
  const colors = useAppColors();

  return (
    <View style={styles.signupWrapper}>
      <ThemedText style={[styles.signupTitle, { color: colors.darkGrey }]}>{title}</ThemedText>
      <TouchableOpacity onPress={onPress}>
        <ThemedText style={styles.signupText}>{textLink}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  signupTitle: {
    fontSize: 14,
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
