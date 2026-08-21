import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function MiniButton({
  disabled,
  title,
  buttonStyle,
  textStyle,
  onPress,
}: {
  disabled?: boolean;
  title: string;
  buttonStyle: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle]}
      disabled={disabled || !onPress}
    >
      <ThemedText mono style={[styles.buttonText, textStyle]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
  },
});
