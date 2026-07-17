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

import { useAppColors } from "@/hooks/use-app-colors";
import { role } from "@/lib/constants";
import { FooterButton, RoleBackground } from "@/lib/types";

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
  const colors = useAppColors();
  const hasButtons = buttons.length > 0;

  const getBackgroundColor = (type: RoleBackground) => {
    switch (type) {
      case role.auth:
        return colors.background;
      case role.parent:
        return colors.parentBackground;
      case role.kid:
        return colors.darkBlue;
      default:
        return colors.background;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: insets.top + 20,
      backgroundColor: getBackgroundColor(screen),
      paddingBottom: modal ? insets.bottom : 0,
    },
    hasButtons: {
      paddingVertical: 10,
    },
  });

  const content = (
    <View style={[styles.container, dynamicStyles.container, containerStyle]}>
      {children}

      {buttons && (
        <View style={hasButtons && dynamicStyles.hasButtons}>
          <ButtonsFooter buttons={buttons} />
        </View>
      )}
    </View>
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
  container: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
});
