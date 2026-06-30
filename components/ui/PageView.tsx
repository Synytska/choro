import { forwardRef, ReactNode } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
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
  }: {
    children: ReactNode;
    buttons?: FooterButton[];
    dismissKeyboardOnPress?: boolean;
    background?: RouteType;
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
      paddingBottom: insets.bottom + 10 || 16,
      paddingTop: insets.top,
      backgroundColor: getBackgroundColor(background),
    },
  });

  const content = (
    <View style={[styles.container, dynamicStyles.container]}>
      {children}
      {buttons && <ButtonsFooter buttons={buttons} />}
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
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
