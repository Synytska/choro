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
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

import { Palette } from "@/constants/theme";
import { useAppColors } from "@/hooks/use-app-colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import { buttonVariant } from "@/lib/constants";
import { ButtonVariant } from "@/lib/types";

import { ThemedText } from "../themed-text";

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
  const colors = useAppColors();
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
        <ActivityIndicator color={colors.white} style={styles.loader} />
      ) : (
        <View style={styles.buttonWrapper}>
          <ThemedText
            mono
            child={variant === buttonVariant.secondary ? true : false}
            style={[
              styles.text,
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
  loader: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.white,
  },
  secondaryText: {
    textTransform: "uppercase",
    color: Palette.black,
    fontSize: 22,
  },
});
