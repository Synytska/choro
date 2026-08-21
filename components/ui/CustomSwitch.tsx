import { Switch } from "react-native";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export function CustomSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const switchOff = useThemeColor({}, "switchOff");

  return (
    <Switch
      trackColor={{ false: switchOff, true: Palette.orange }}
      thumbColor={Palette.white}
      ios_backgroundColor={switchOff}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
