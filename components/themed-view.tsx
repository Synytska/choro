import { StyleSheet, View, type ViewProps } from "react-native";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  child?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  child,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  const styles = StyleSheet.create({
    childContainer: {
      borderWidth: 2,
      borderColor: Palette.borderBlue,
      backgroundColor: Palette.darkNavy,
      borderRadius: 16,
    },
  });

  return (
    <View style={[{ backgroundColor }, child && styles.childContainer, style]} {...otherProps} />
  );
}
