/**
 * Google OAuth button used on parent sign in and sign up screens.
 *
 * Props:
 * - disabled: optionally blocks Google auth while another auth request is pending.
 */
import { TouchableOpacity } from "react-native";

import GoogleIcon from "@/assets/svg-icons/GoogleIcon";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";

import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { styles } from "./styles";

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
      style={[globalStyles.kidShadow, styles.googleWrapper, { backgroundColor: background }]}
    >
      <GoogleIcon style={styles.icon} />
    </TouchableOpacity>
  );
}
