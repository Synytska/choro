import { StyleSheet, Text, type TextProps } from "react-native";

import { Fonts, Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { textType } from "@/lib/constants";
import { TextType } from "@/lib/types";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextType;
  mono?: boolean;
  child?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = textType.default,
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
        type === textType.default ? styles.default : undefined,
        type === textType.title ? styles.title : undefined,
        type === textType.titleChild ? [styles.titleChild, dynamicStyles.child] : undefined,
        type === textType.subtitleChild ? [styles.subtitleChild, dynamicStyles.child] : undefined,
        type === textType.subtitle ? [styles.subtitle, dynamicStyles.subtitle] : undefined,
        type === textType.link ? styles.link : undefined,
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  titleChild: {
    fontSize: 24,
    lineHeight: 25,
  },
  subtitleChild: {
    fontSize: 20,
    lineHeight: 21,
  },
  subtitle: {
    fontSize: 14,
  },
  link: {
    fontSize: 16,
    color: Palette.blue,
  },
});
