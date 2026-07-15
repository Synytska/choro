import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomScrollViewProps = {
  showsVerticalScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  horizontal?: boolean;
};

export function CustomScrollView({
  showsVerticalScrollIndicator = false,
  style,
  contentContainerStyle,
  children,
  horizontal,
}: CustomScrollViewProps) {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    scrollView: { paddingBottom: insets.bottom },
  });

  return (
    <ScrollView
      style={style}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.scrollView, contentContainerStyle]}
      horizontal={horizontal}
    >
      {children}
    </ScrollView>
  );
}
