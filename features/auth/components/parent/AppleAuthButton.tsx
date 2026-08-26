/**
 * Native Sign in with Apple button for parent auth screens.
 *
 * Props:
 * - disabled: optionally blocks Apple auth while another auth request is pending.
 */
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";

import { useAppleAuth } from "../../hooks/useAppleAuth";
import { styles } from "./styles";

type AppleAuthButtonProps = {
  disabled?: boolean;
};

export function AppleAuthButton({ disabled = false }: AppleAuthButtonProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const { mutate: signInWithApple, isPending } = useAppleAuth();
  const isDisabled = disabled || isPending;

  const background = useThemeColor({}, "background");

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    let isMounted = true;

    AppleAuthentication.isAvailableAsync().then((available) => {
      if (isMounted) {
        setIsAvailable(available);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAvailable) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (!isDisabled) {
          signInWithApple();
        }
      }}
      style={[
        globalStyles.kidShadow,
        styles.googleWrapper,
        { backgroundColor: background },
        isDisabled && styles.disabledOAuthButton,
      ]}
    >
      <AppIcon icon={Icons.apple} size={30} color={Palette.darkNavy} />
    </TouchableOpacity>
  );
}
