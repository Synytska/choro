import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppColors } from "@/hooks/use-app-colors";

export function SectionTitle({ title, color }: { title: string; color?: string }) {
  const colors = useAppColors();
  const accent = color ?? colors.green;

  return (
    <View style={styles.wrapper}>
      <ThemedText child style={[styles.title, { color: accent }]}>
        {title}
      </ThemedText>
      <View style={[styles.divider, { borderColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    textTransform: "uppercase",
  },
  divider: {
    borderWidth: 2,
    width: "24%",
    borderRadius: 20,
  },
});
