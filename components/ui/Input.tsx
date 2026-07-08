/**
 * Shared text input with label, animated focus/error border, and optional password visibility toggle.
 *
 * Props:
 * - label/placeholder/value/onChangeText: standard controlled input fields.
 * - error: message shown below the input and switches border to error color.
 * - secureTextEntry: enables password mode with show/hide icon.
 * - keyboardType/autoCapitalize/maxLength: forwarded TextInput behavior.
 * - variant: parent or kid color treatment.
 */
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { useAppColors } from "@/hooks/use-app-colors";

import { AppIcon, Icons } from "./AppIcon";

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default" | "numeric" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "characters";
  variant?: "parent" | "kid";
  maxLength?: number;
  inputType?: "textarea" | "plain";
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  variant = "parent",
  maxLength,
  inputType = "plain",
}: InputProps) {
  const colors = useAppColors();

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isTextarea = inputType === "textarea";

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor:
      variant === "parent"
        ? withTiming(isFocused ? colors.orange : error ? colors.error : colors.middleGrey, {
            duration: 200,
          })
        : withTiming(isFocused ? colors.middleGrey : error ? colors.error : colors.green, {
            duration: 200,
          }),
  }));

  const dynamicStyles = StyleSheet.create({
    label: {
      color: colors.black,
    },
    parentInput: {
      backgroundColor: colors.white,
      borderColor: colors.middleGrey,
    },
    kidInput: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.green,
    },
    error: {
      color: colors.error,
    },
  });

  return (
    <View>
      {label && <Text style={[styles.label, dynamicStyles.label]}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputContainer,
          isTextarea && styles.textareaContainer,
          variant === "parent" && dynamicStyles.parentInput,
          variant === "kid" && dynamicStyles.kidInput,
          animatedStyle,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            isTextarea && styles.textarea,
            { color: variant === "parent" ? colors.black : colors.white },
          ]}
          placeholder={placeholder}
          placeholderTextColor={variant === "parent" ? colors.darkGrey : colors.green}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isTextarea && secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={isTextarea ? (maxLength ?? 100) : maxLength}
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          textAlignVertical={isTextarea ? "top" : "center"}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            {showPassword ? (
              <AppIcon icon={Icons.eye} size={18} color={colors.darkGrey} />
            ) : (
              <AppIcon icon={Icons.eyeClosed} size={18} color={colors.darkGrey} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && <Text style={[styles.error, dynamicStyles.error]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: 500,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  textarea: {
    minHeight: 100,
  },
  textareaContainer: {
    alignItems: "flex-start",
  },
});
