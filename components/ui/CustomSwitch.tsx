import { Switch } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

export function CustomSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const colors = useAppColors();

  return (
    <Switch
      trackColor={{ false: colors.middleGrey, true: colors.orange }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.middleGrey}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
