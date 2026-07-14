import { Skeleton } from "moti/skeleton";
import { StyleProp, View, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

type SkeletonBlockProps = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number | "round" | "square";
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 8,
  style,
}: SkeletonBlockProps) {
  const colors = useAppColors();

  return (
    <View style={style}>
      <Skeleton
        show
        colorMode="light"
        width={width}
        height={height}
        radius={radius}
        colors={[colors.lightGrey, colors.middleGrey, colors.lightGrey]}
      />
    </View>
  );
}
