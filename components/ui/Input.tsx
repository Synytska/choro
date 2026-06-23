// app/components/ui/Input.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default" | "numeric";
  autoCapitalize?: "none" | "sentences";
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(
      isFocused ? Colors.green : error ? Colors.error : Colors.middleGrey,
      { duration: 200 },
    ),
  }));

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View style={[styles.inputContainer, animatedStyle]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.darkGrey}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={10}
          >
            {showPassword ? (
              <Feather name="eye" size={18} color={Colors.darkGrey} />
            ) : (
              <Feather name="eye-off" size={18} color={Colors.darkGrey} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.darkGrey,
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.middleGrey,
  },
  input: {
    flex: 1,
    color: Colors.black,
    fontSize: 16,
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
});
