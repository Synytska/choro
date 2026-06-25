import { forwardRef, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonsFooter from "./ButtonsFooter";
import { FooterButton } from "@/lib/types";
import { useAppColors } from "@/hooks/use-app-colors";

const PageView = forwardRef(
  (
    {
      children,
      buttons = [],
    }: { children: ReactNode; buttons?: FooterButton[] },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const colors = useAppColors();

    const dynamicStyles = StyleSheet.create({
      container: {
        paddingBottom: insets.bottom + 10 || 16,
        paddingTop: insets.top,
        backgroundColor: colors.background,
      },
    });

    return (
      <View style={[styles.container, dynamicStyles.container]}>
        {children}
        {buttons && <ButtonsFooter buttons={buttons} />}
      </View>
    );
  },
);

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
