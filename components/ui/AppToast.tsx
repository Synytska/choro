import { StyleSheet } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";

import { ThemedView } from "../themed-view";

type AppToastProps = BaseToastProps & {
  type?: "success" | "error" | "info";
};

export default function AppToast({ text1, text2, type = "info" }: AppToastProps) {
  const borderColor = {
    success: Palette.darkGreen,
    error: Palette.error,
    info: Palette.white,
  }[type];

  return (
    <ThemedView style={[styles.container, { borderColor: borderColor }, globalStyles.shadow]}>
      <ThemedText style={styles.title}>{text1}</ThemedText>

      {!!text2 && <ThemedText style={styles.subtitle}>{text2}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "92%",
    alignSelf: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderLeftWidth: 20,
    borderWidth: 0.8,
    borderColor: "green",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
