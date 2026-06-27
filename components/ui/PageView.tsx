import { forwardRef, ReactNode } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonsFooter from "./ButtonsFooter";
import { FooterButton } from "@/lib/types";
import { useAppColors } from "@/hooks/use-app-colors";

const PageView = forwardRef(function PageView(
  {
    children,
    buttons = [],
    dismissKeyboardOnPress = false,
  }: {
    children: ReactNode;
    buttons?: FooterButton[];
    dismissKeyboardOnPress?: boolean;
  },
  ref,
) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingBottom: insets.bottom + 10 || 16,
      paddingTop: insets.top,
      backgroundColor: colors.background,
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
    paddingTop: 10,
    paddingHorizontal: 20,
  },
});
