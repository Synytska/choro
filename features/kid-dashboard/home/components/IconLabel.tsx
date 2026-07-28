import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type IconLabelProps = {
  backgroundColor: string;
  icon: ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconLabel({ backgroundColor, icon, size = 32, style }: IconLabelProps) {
  const styles = StyleSheet.create({
    wrapper: {
      borderRadius: 10,
      backgroundColor: backgroundColor,
      width: size,
      height: size,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return <View style={[styles.wrapper, style]}>{icon}</View>;
}
