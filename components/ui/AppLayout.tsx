import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppLayout({ children, style }: AppLayoutProps) {
  return (
    <SafeAreaView style={[styles.wrapper, style]}>{children}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
