import { Skeleton } from "moti/skeleton";
import { StyleProp, View, ViewStyle } from "react-native";

import { Palette } from "@/constants/theme";

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
  const theme = child
    ? [Palette.darkGrey, Palette.darkNavy, Palette.darkGreen]
    : [Palette.lightGrey, Palette.middleGrey, Palette.darkGrey];

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
