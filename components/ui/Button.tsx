// app/components/ui/Button.tsx
import { ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { ThemedText } from "../themed-text";
import { Colors } from "@/constants/theme";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.9}
      style={[
        styles.buttonBase,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        (loading || disabled) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} style={styles.loader} />
      ) : (
        <ThemedText
          style={[styles.text, variant === "outline" && styles.outlineText]}
        >
          {children}
        </ThemedText>
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
  },
  primary: {
    backgroundColor: Colors.darkNavy,
  },
  secondary: {
    backgroundColor: Colors.logoDotRed,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.darkNavy,
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
    color: Colors.white,
  },
  outlineText: {
    color: Colors.black,
  },
});
