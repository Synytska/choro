import { StyleSheet, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

import { ThemedText } from "@/components/themed-text";
import { useAppColors } from "@/hooks/use-app-colors";

type AppToastProps = BaseToastProps & {
  type?: "success" | "error" | "info";
};

export default function AppToast({ text1, text2, type = "info" }: AppToastProps) {
  const colors = useAppColors();

  const borderColor = {
    success: colors.darkGreen,
    error: colors.error,
    info: colors.white,
  }[type];

  const dynamicStyles = StyleSheet.create({
    container: {
      borderColor: borderColor,
      backgroundColor: colors.white,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ThemedText style={styles.title}>{text1}</ThemedText>

      {!!text2 && <ThemedText style={styles.subtitle}>{text2}</ThemedText>}
    </View>
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

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
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
