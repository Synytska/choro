/**
 * Google OAuth button used on parent sign in and sign up screens.
 *
 * Props:
 * - disabled: optionally blocks Google auth while another auth request is pending.
 */
import { StyleSheet, TouchableOpacity } from "react-native";

import GoogleIcon from "@/assets/svg-icons/GoogleIcon";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";

import { useGoogleAuth } from "../../hooks/useGoogleAuth";

type GoogleAuthButtonProps = {
  disabled?: boolean;
};

export function GoogleAuthButton({ disabled = false }: GoogleAuthButtonProps) {
  const background = useThemeColor({}, "background");

  const { mutate: signInWithGoogle, isPending } = useGoogleAuth();

  return (
    <TouchableOpacity
      onPress={() => signInWithGoogle()}
      disabled={disabled || isPending}
      style={[globalStyles.kidShadow, styles.wrapper, { backgroundColor: background }]}
    >
      <GoogleIcon style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    shadowColor: Palette.darkGrey,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
