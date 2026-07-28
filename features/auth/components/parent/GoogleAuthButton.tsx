/**
 * Google OAuth button used on parent sign in and sign up screens.
 *
 * Props:
 * - disabled: optionally blocks Google auth while another auth request is pending.
 */
import { StyleSheet, TouchableOpacity } from "react-native";

import GoogleIcon from "@/assets/svg-icons/GoogleIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

import { useGoogleAuth } from "../../hooks/useGoogleAuth";

type GoogleAuthButtonProps = {
  disabled?: boolean;
};

export function GoogleAuthButton({ disabled = false }: GoogleAuthButtonProps) {
  const colors = useAppColors();
  const { mutate: signInWithGoogle, isPending } = useGoogleAuth();

  return (
    <TouchableOpacity
      onPress={() => signInWithGoogle()}
      disabled={disabled || isPending}
      style={[
        globalStyles.kidShadow,
        styles.wrapper,
        { backgroundColor: colors.parentBackground, shadowColor: colors.darkGrey },
      ]}
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
  },
  icon: {
    width: 25,
    height: 25,
  },
});
