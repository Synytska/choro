import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";
import { AppIcon, Icons } from "./AppIcon";

type StepperProps = {
  decrease: () => void;
  increase: () => void;
  value: number;
  buttonSize?: number;
  iconSize?: number;
  valueStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

export function Stepper({
  decrease,
  increase,
  value,
  buttonSize,
  valueStyle,
  iconSize = 14,
  style,
}: StepperProps) {
  const dynamicStyles = StyleSheet.create({
    button: {
      borderColor: Palette.middleGrey,
      backgroundColor: Palette.orange,
      width: buttonSize || 24,
      height: buttonSize || 24,
    },
  });

  return (
    <View style={[styles.buttonsWrapper, style]}>
      <TouchableOpacity
        hitSlop={8}
        onPress={decrease}
        style={[styles.button, dynamicStyles.button]}
      >
        <AppIcon icon={Icons.minus} color={Palette.white} size={iconSize} />
      </TouchableOpacity>

      <ThemedText style={[styles.value, valueStyle]}>{value}</ThemedText>

      <TouchableOpacity
        hitSlop={8}
        onPress={increase}
        style={[styles.button, dynamicStyles.button]}
      >
        <AppIcon icon={Icons.add} color={Palette.white} size={iconSize} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 700,
    minWidth: 28,
    textAlign: "center",
  },
});
