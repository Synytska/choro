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

import { useAppColors } from "@/hooks/use-app-colors";
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

  const dynamicStyles = StyleSheet.create({
    primary: {
      backgroundColor: colors.orange,
    },
    secondary: {
      backgroundColor: colors.green,
    },
    thirdly: {
      backgroundColor: colors.darkNavy,
    },
    outline: {
      borderColor: colors.orange,
    },
    text: {
      color: colors.white,
    },
    outlineText: {
      color: colors.black,
    },
    secondaryText: {
      textTransform: "uppercase",
      color: colors.black,
      fontSize: 22,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.9}
      style={[
        styles.buttonBase,
        variant === buttonVariant.primary && dynamicStyles.primary,
        variant === buttonVariant.secondary && dynamicStyles.secondary,
        variant === buttonVariant.thirdly && dynamicStyles.thirdly,
        variant === buttonVariant.outline && [styles.outline, dynamicStyles.outline],
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
              dynamicStyles.text,
              variant === buttonVariant.secondary && dynamicStyles.secondaryText,
              variant === buttonVariant.outline && dynamicStyles.outlineText,
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
  buttonBase: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  outline: {
    borderWidth: 1,
    backgroundColor: "transparent",
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
  },
});
