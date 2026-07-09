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
    hasBottomPadding = false,
  }: {
    children: ReactNode;
    buttons?: FooterButton[];
    dismissKeyboardOnPress?: boolean;
    background?: RouteType;
    containerStyle?: StyleProp<ViewStyle>;
    hasBottomPadding?: boolean;
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

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
      paddingBottom: hasBottomPadding ? insets.bottom + 10 : 10,
      paddingTop: insets.top + 20 || 20,
      backgroundColor: getBackgroundColor(background),
    },
  });

  const content = (
    <View style={[styles.container, dynamicStyles.container, containerStyle]}>
      <View style={styles.content}>{children}</View>
      {buttons.length > 0 && <ButtonsFooter buttons={buttons} />}
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
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 20,
    gap: 20,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
