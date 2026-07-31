import { StyleSheet, View } from "react-native";

import { Palette } from "@/constants/theme";
import { IconType } from "@/lib/types";

import { AppIcon } from "./AppIcon";

type TabIconProps = {
  focused: boolean;
  icon: IconType;
  activeColor: string;
};

export function TabIcon({ focused, icon, activeColor }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.focused]}>
      <AppIcon icon={icon} size={22} color={focused ? Palette.darkNavy : activeColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 46,
    borderColor: Palette.borderBlue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  focused: {
    backgroundColor: Palette.green,
    shadowColor: Palette.darkGreen,
    shadowOpacity: 0.65,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 14,
  },
});
