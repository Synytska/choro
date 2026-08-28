/**
 * Reusable app button used in forms, footers, and dashboard actions.
 *
 * Props:
 * - children: button label/content.
 * - onPress: action called when the button is pressed.
 * - loading/disabled: block interaction and show disabled/loading state.
 * - variant/textStyle/icon: visual style overrides and optional icon content.
 */
import { ReactNode } from "react";
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { buttonVariant } from "@/lib/constants";
import { ButtonVariant } from "@/lib/types";

import { ThemedText } from "../themed-text";
import { LogoLoader } from "./LogoLoader";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
}

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = buttonVariant.primary,
  textStyle,
  icon,
}: ButtonProps) {
  const textOutline = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.9}
      style={[
        styles.buttonBase,
        variant === buttonVariant.primary && styles.primary,
        variant === buttonVariant.secondary && styles.secondary,
        variant === buttonVariant.thirdly && styles.thirdly,
        variant === buttonVariant.outline && styles.outline,
        (loading || disabled) && styles.disabled,
      ]}
    >
      {loading ? (
        <LogoLoader size={30} dotColor={Palette.error} />
      ) : (
        <View style={styles.buttonWrapper}>
          <ThemedText
            mono
            child={variant === buttonVariant.secondary}
            style={[
              styles.text,
              variant !== buttonVariant.secondary && styles.textParent,
              variant === buttonVariant.secondary && styles.secondaryText,
              variant === buttonVariant.outline && { color: textOutline },
              textStyle,
            ]}
          >
            {children}
          </ThemedText>
          {icon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.orange,
  },
  secondary: {
    backgroundColor: Palette.green,
  },
  thirdly: {
    backgroundColor: Palette.darkNavy,
  },
  buttonBase: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    alignSelf: "stretch",
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  outline: {
    borderWidth: 1,
    backgroundColor: "transparent",
    borderColor: Palette.orange,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    color: Palette.white,
  },
  textParent: {
    fontWeight: "800",
  },
  secondaryText: {
    textTransform: "uppercase",
    color: Palette.black,
    fontSize: 18,
  },
});
