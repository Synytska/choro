import { StyleSheet, Text, type TextProps } from "react-native";

import { Fonts } from "@/constants/theme";
import { useAppColors } from "@/hooks/use-app-colors";
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
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    subtitle: {
      color: colors.darkGrey,
    },
    mono: {
      fontFamily: Fonts.mono,
    },
    child: {
      fontFamily: Fonts.kid,
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
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
