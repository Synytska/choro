import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { ThemedView } from "@/components/themed-view";

type ScreenContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <ThemedView style={[styles.container, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
