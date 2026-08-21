import { ReactNode } from "react";
import { RefreshControl, ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Palette } from "@/constants/theme";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUserRole } from "@/store/selectors";

type CustomScrollViewProps = {
  showsVerticalScrollIndicator?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  horizontal?: boolean;
  nestedScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: "never" | "always" | "handled";
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function CustomScrollView({
  showsVerticalScrollIndicator = false,
  style,
  contentContainerStyle,
  children,
  horizontal,
  nestedScrollEnabled = false,
  keyboardShouldPersistTaps,
  refreshing = false,
  onRefresh,
}: CustomScrollViewProps) {
  const insets = useSafeAreaInsets();
  const role = useAppSelector(selectAuthUserRole);

  const styles = StyleSheet.create({
    scrollView: { paddingBottom: insets.bottom, flexGrow: 1 },
  });

  return (
    <ScrollView
      style={style}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.scrollView, contentContainerStyle]}
      horizontal={horizontal}
      nestedScrollEnabled={nestedScrollEnabled}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      refreshControl={
        onRefresh && !horizontal ? (
          <RefreshControl
            tintColor={role === "kid" ? Palette.white : Palette.darkNavy}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}
