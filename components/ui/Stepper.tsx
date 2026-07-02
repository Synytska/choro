import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";
import { AppIcon, Icons } from "./AppIcon";

type StepperType = {
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
}: StepperType) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    button: {
      borderColor: colors.middleGrey,
      backgroundColor: colors.orange,
      width: buttonSize || 24,
      height: buttonSize || 24,
    },
  });

  return (
    <View style={[styles.buttonsWrapper, style]}>
      <TouchableOpacity onPress={decrease} style={[styles.button, dynamicStyles.button]}>
        <AppIcon icon={Icons.minus} color={colors.white} size={iconSize} />
      </TouchableOpacity>

      <ThemedText style={[styles.value, valueStyle]}>{value}</ThemedText>

      <TouchableOpacity onPress={increase} style={[styles.button, dynamicStyles.button]}>
        <AppIcon icon={Icons.add} color={colors.white} size={iconSize} />
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
  },
});
