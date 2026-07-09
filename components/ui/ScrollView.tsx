import { ReactNode } from "react";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarHeight } from "@/lib/constants";

type CustomScrollView = {
  showsVerticalScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function CustomScrollView({
  showsVerticalScrollIndicator = false,
  style,
  contentContainerStyle,
  children,
}: CustomScrollView) {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    scrollView: { paddingBottom: insets.bottom + tabBarHeight },
  });

  return (
    <ScrollView
      style={style}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.scrollView, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}
