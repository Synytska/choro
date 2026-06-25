// app/components/ui/Button.tsx
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  View,
} from "react-native";
import { ReactNode } from "react";
import { ThemedText } from "../themed-text";
import { useAppColors } from "@/hooks/use-app-colors";
import { ButtonVariant } from "@/lib/types";

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
  variant = "primary",
  textStyle,
  icon,
}: ButtonProps) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    primary: {
      backgroundColor: colors.darkNavy,
    },
    secondary: {
      backgroundColor: colors.green,
    },
    outline: {
      borderColor: colors.darkNavy,
    },
    text: {
      color: colors.white,
    },
    outlineText: {
      color: colors.black,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.9}
      style={[
        styles.buttonBase,
        variant === "primary" && dynamicStyles.primary,
        variant === "secondary" && dynamicStyles.secondary,
        variant === "outline" && [styles.outline, dynamicStyles.outline],
        (loading || disabled) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} style={styles.loader} />
      ) : (
        <View style={styles.buttonWrapper}>
          <ThemedText
            style={[
              styles.text,
              dynamicStyles.text,
              variant === "secondary" && dynamicStyles.outlineText,
              variant === "outline" && dynamicStyles.outlineText,
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
    height: 56,
    flexGrow:1
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
