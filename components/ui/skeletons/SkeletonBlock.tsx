import { Skeleton } from "moti/skeleton";
import { StyleProp, View, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number | "round" | "square";
  style?: StyleProp<ViewStyle>;
  child?: boolean;
};

export function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 8,
  style,
  child,
}: SkeletonBlockProps) {
  const colors = useAppColors();

  const theme = child
    ? [colors.darkGrey, colors.darkNavy, colors.darkGreen]
    : [colors.lightGrey, colors.middleGrey, colors.darkGrey];

  return (
    <View style={style}>
      <Skeleton
        show
        colorMode="light"
        width={width}
        height={height}
        radius={radius}
        colors={theme}
      />
    </View>
  );
}
