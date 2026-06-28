// app/components/ui/Input.tsx
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { useAppColors } from "@/hooks/use-app-colors";

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
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const colors = useAppColors();

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor:
      variant === "parent"
        ? withTiming(isFocused ? colors.green : error ? colors.error : colors.middleGrey, {
            duration: 200,
          })
        : withTiming(isFocused ? colors.middleGrey : error ? colors.error : colors.green, {
            duration: 200,
          }),
  }));

  const dynamicStyles = StyleSheet.create({
    label: {
      color: colors.darkGrey,
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
          variant === "parent" && dynamicStyles.parentInput,
          variant === "kid" && dynamicStyles.kidInput,
          animatedStyle,
        ]}
      >
        <TextInput
          style={[styles.input, { color: variant === "parent" ? colors.black : colors.white }]}
          placeholder={placeholder}
          placeholderTextColor={variant === "parent" ? colors.darkGrey : colors.green}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
            {showPassword ? (
              <Feather name="eye" size={18} color={colors.darkGrey} />
            ) : (
              <Feather name="eye-off" size={18} color={colors.darkGrey} />
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
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
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
});
