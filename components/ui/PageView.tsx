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
import { FooterButton } from "@/lib/types";

import ButtonsFooter from "./ButtonsFooter";

export type RouteType = "auth" | "parent" | "kid";

const PageView = forwardRef(function PageView(
  {
    children,
    buttons = [],
    dismissKeyboardOnPress = false,
    background = "auth",
    containerStyle,
  }: {
    children: ReactNode;
    buttons?: FooterButton[];
    dismissKeyboardOnPress?: boolean;
    background?: RouteType;
    containerStyle?: StyleProp<ViewStyle>;
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();
  const hasButtons = buttons.length > 0;

  const getBackgroundColor = (type: RouteType) => {
    switch (type) {
      case "auth":
        return colors.background;
      case "parent":
        return colors.parentBackground;
      case "kid":
        return colors.darkBlue;
      default:
        return colors.background;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingTop: insets.top + 20 || 20,
      backgroundColor: getBackgroundColor(background),
    },
    hasButtons: {
      paddingBottom: insets.bottom + 10,
    },
  });

  const content = (
    <View
      style={[
        styles.container,
        dynamicStyles.container,
        containerStyle,
        hasButtons && dynamicStyles.hasButtons,
      ]}
    >
      {children}
      {hasButtons && <ButtonsFooter buttons={buttons} />}
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
  },
});
