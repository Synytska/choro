import { StyleSheet, View, type ViewProps } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
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
  const colors = useAppColors();

  const styles = StyleSheet.create({
    childContainer: {
      borderWidth: 2,
      borderColor: colors.borderBlue,
      backgroundColor: colors.darkNavy,
      borderRadius: 16,
    },
  });

  return (
    <View style={[{ backgroundColor }, child && styles.childContainer, style]} {...otherProps} />
  );
}
