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
import { ReactNode, useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

import { ThemedText } from "../themed-text";
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
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  iconOnPress?: () => void;
  disabled?: boolean;
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
  style,
  icon,
  iconOnPress,
  disabled = false,
}: InputProps) {
  const input = useThemeColor({}, "input");
  const text = useThemeColor({}, "text");

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isTextarea = inputType === "textarea";

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor:
      variant === "parent"
        ? withTiming(isFocused ? Palette.orange : error ? Palette.error : Palette.middleGrey, {
            duration: 200,
          })
        : withTiming(isFocused ? Palette.middleGrey : error ? Palette.error : Palette.green, {
            duration: 200,
          }),
  }));

  const dynamicStyles = StyleSheet.create({
    parentInput: {
      backgroundColor: input,
      borderColor: Palette.middleGrey,
    },
  });

  return (
    <View>
      {label && (
        <ThemedText style={[styles.label, disabled && styles.disabledStyle]}>{label}</ThemedText>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          isTextarea && styles.textareaContainer,
          variant === "parent" && dynamicStyles.parentInput,
          variant === "kid" && styles.kidInput,
          animatedStyle,
          style,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            isTextarea && styles.textarea,
            { color: variant === "parent" ? text : Palette.white },
            disabled && styles.disabledStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={variant === "parent" ? Palette.darkGrey : Palette.green}
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
          editable={!disabled}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            {showPassword ? (
              <AppIcon icon={Icons.eye} size={18} color={Palette.darkGrey} />
            ) : (
              <AppIcon icon={Icons.eyeClosed} size={18} color={Palette.darkGrey} />
            )}
          </TouchableOpacity>
        )}
        {icon && <TouchableOpacity onPress={iconOnPress}>{icon}</TouchableOpacity>}
      </Animated.View>

      {error && <Text style={styles.error}>{error}</Text>}
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
    paddingVertical: Platform.OS === "ios" ? 16 : 6,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  disabledStyle: {
    opacity: 0.5,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
    color: Palette.error,
  },
  textarea: {
    minHeight: 100,
  },
  textareaContainer: {
    alignItems: "flex-start",
  },
  kidInput: {
    borderColor: Palette.green,
  },
});
