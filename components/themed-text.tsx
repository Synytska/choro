import { StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  mono?: boolean;
  child?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  mono = false,
  child = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const dynamicStyles = StyleSheet.create({
    subtitle: {
      color: Palette.darkGrey,
    },
    mono: {
      fontFamily: Fonts.mono,
    },
    child: {
      fontFamily: Fonts.kid,
      letterSpacing: 1.6,
    },
  });

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? [styles.subtitle, dynamicStyles.subtitle] : undefined,
        type === "link" ? styles.link : undefined,
        style,
        mono && dynamicStyles.mono,
        child && dynamicStyles.child,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  link: {
    fontSize: 16,
    color: Palette.blue,
  },
});
