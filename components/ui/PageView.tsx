/**
 * Base full-screen layout wrapper used by auth, onboarding, parent, and kid screens.
 *
 * Props:
 * - children: main screen content.
 * - buttons: footer button configs rendered through ButtonsFooter.
 * - dismissKeyboardOnPress: wraps content so tapping outside inputs dismisses the keyboard.
 * - background: selects the themed background for auth, parent, or kid flows.
 * - containerStyle: optional layout override for padding, gaps, or screen-specific spacing.
 *
 * Also forwards a ref through forwardRef for screens that need direct view access.
 */
import { forwardRef, ReactNode } from "react";
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { paddingHorizontal, role } from "@/lib/constants";
import { FooterButton, RoleBackground } from "@/lib/types";

import { ThemedView } from "../themed-view";
import ButtonsFooter from "./ButtonsFooter";

const PageView = forwardRef(function PageView(
  {
    children,
    buttons = [],
    dismissKeyboardOnPress = false,
    screen = role.auth,
    containerStyle,
    modal,
  }: {
    children: ReactNode;
    buttons?: FooterButton[];
    dismissKeyboardOnPress?: boolean;
    screen?: RoleBackground;
    containerStyle?: StyleProp<ViewStyle>;
    modal?: boolean;
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const hasButtons = buttons.length > 0;
  const kidRole = screen === role.kid;

  const getBackgroundColor = (type: RoleBackground) => {
    switch (type) {
      case role.auth:
        return Palette.white;
      case role.parent:
        return Palette.parentBackground;
      case role.kid:
      case role.kidLogin:
        return Palette.darkBlue;
      default:
        return Palette.white;
    }
  };

  const background = useThemeColor(
    { light: getBackgroundColor(screen), dark: Palette.darkBlue },
    "background",
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: kidRole ? 0 : modal ? 50 : insets.top + 20,
      backgroundColor: background,
      paddingBottom: modal ? insets.bottom : 0,
    },
  });

  const content = (
    <ThemedView style={[styles.container, dynamicStyles.container, containerStyle]}>
      {children}

      {buttons && (
        <View style={hasButtons && styles.hasButtons}>
          <ButtonsFooter buttons={buttons} />
        </View>
      )}
    </ThemedView>
  );

  if (!dismissKeyboardOnPress) {
    return content;
  }

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      {content}
    </TouchableWithoutFeedback>
  );
});

export default PageView;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: paddingHorizontal,
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  hasButtons: {
    paddingVertical: 10,
  },
});
