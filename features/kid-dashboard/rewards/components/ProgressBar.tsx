import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAppColors } from "@/hooks/use-app-colors";

export function ProgressBar({
  progress,
  progressLabel,
  progressLabelStyle,
}: {
  progress: number;
  progressLabel: string;
  progressLabelStyle?: StyleProp<TextStyle>;
}) {
  const colors = useAppColors();

  return (
    <View style={styles.progressWrapper}>
      <View style={[styles.progressTrack, { backgroundColor: colors.borderBlue }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.green, width: `${progress * 100}%` },
          ]}
        />
      </View>
      <ThemedText
        child
        style={[styles.progressText, { color: colors.middleGrey }, progressLabelStyle]}
      >
        {progressLabel}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrapper: {
    width: "100%",
    gap: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
  },
});
