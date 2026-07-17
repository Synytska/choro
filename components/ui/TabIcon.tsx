import { StyleSheet, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { AppIconConfig } from "@/lib/types";

import { AppIcon } from "./AppIcon";

type TabIconProps = {
  focused: boolean;
  icon: AppIconConfig;
  activeColor: keyof ReturnType<typeof useAppColors>;
};

export function TabIcon({ focused, icon, activeColor }: TabIconProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.iconContainer,
        { borderColor: colors.borderBlue },
        focused && {
          backgroundColor: colors.green,
          shadowColor: colors.darkGreen,
          shadowOpacity: 0.65,
          shadowRadius: 14,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          elevation: 14,
        },
      ]}
    >
      <AppIcon icon={icon} size={22} color={focused ? colors.darkNavy : colors[activeColor]} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 46,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,
    borderWidth: 1,
  },
});
