import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Palette } from "@/constants/theme";
import { authTabBarHeight, authTabBarWidth } from "@/lib/constants";

export function AuthTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isParent = state.routes[state.index].name === "login";

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <BlurView
        intensity={20}
        tint={isParent ? "light" : "dark"}
        style={[
          styles.blurContainer,
          {
            backgroundColor: isParent ? "rgba(255, 255, 255, 0.86)" : "rgba(41, 72, 149, 0.35)",
            borderColor: isParent ? Palette.lightGrey : Palette.borderBlue,
          },
        ]}
      >
        <View style={styles.tabsContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = state.index === index;

            const isParent = route.name === "login";
            const tabColors =
              !focused && isParent
                ? Palette.white
                : !focused && !isParent
                  ? Palette.darkNavy
                  : Palette.orange;

            const iconName = isParent ? "person" : "game-controller";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => [
                  styles.tabButton,
                  focused && styles.activeTab,
                  pressed && styles.pressedTab,
                ]}
              >
                <Ionicons name={iconName} size={24} color={tabColors} />

                <Text numberOfLines={1} style={[styles.label, { color: tabColors }]}>
                  {options.title ?? route.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignSelf: "center",
    width: authTabBarWidth,
    height: authTabBarHeight,
    borderRadius: 50,
    shadowColor: Palette.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  tabsContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 6,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: "rgba(150, 150, 150, 0.13)",
  },
  pressedTab: {
    opacity: 0.75,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
