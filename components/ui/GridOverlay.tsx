import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import StarIcon from "@/assets/svg-icons/StarIcon";
import { Palette } from "@/constants/theme";
import { fullScreenHeight } from "@/lib/constants";

const gridSize = 24;

const starsLayer: {
  icon: React.ReactNode;
  style: StyleProp<ViewStyle>;
}[] = [
  {
    icon: <StarIcon />,
    style: {
      left: "10%",
      top: "15%",
    },
  },
  {
    icon: <StarIcon color={Palette.skyBlue} />,
    style: {
      left: "70%",
      top: "25%",
      transform: [{ rotate: "20deg" }],
    },
  },
  {
    icon: <StarIcon color={Palette.skyBlue} />,
    style: {
      left: "30%",
      bottom: "15%",
      transform: [{ rotate: "10deg" }],
    },
  },
  {
    icon: <StarIcon />,
    style: {
      right: "10%",
      bottom: "25%",
    },
  },
];

const confettiLayer: {
  style: StyleProp<ViewStyle>;
}[] = [
  {
    style: {
      backgroundColor: Palette.orange,
      width: 16,
      height: 16,
      right: "6%",
      top: "8%",
    },
  },
  {
    style: {
      backgroundColor: Palette.cyan,
      width: 16,
      height: 16,
      left: "36%",
      top: "3%",
    },
  },
  {
    style: {
      backgroundColor: Palette.skyBlue,
      width: 18,
      height: 6,
      left: "30%",
      top: "35%",
      transform: [{ rotate: "20deg" }],
    },
  },
  {
    style: {
      backgroundColor: Palette.lime,
      width: 16,
      height: 16,
      left: "10%",
      bottom: "35%",
      transform: [{ rotate: "10deg" }],
    },
  },
  {
    style: {
      backgroundColor: Palette.pink,
      width: 18,
      height: 6,
      right: "20%",
      bottom: "45%",
      transform: [{ rotate: "-30deg" }],
    },
  },
];

export default function GridOverlay({
  width,
  height = fullScreenHeight,
  inset = 0,
  withStars,
  withConfetti,
}: {
  width: number;
  height?: number;
  inset?: number;
  withStars?: boolean;
  withConfetti?: boolean;
}) {
  const verticalLines = useMemo(
    () => Array.from({ length: Math.ceil(width / gridSize) + 1 }),
    [width],
  );
  const horizontalLines = useMemo(
    () => Array.from({ length: Math.ceil(height / gridSize) + 1 }),
    [height],
  );

  return (
    <>
      {withStars && (
        <View pointerEvents="none" style={[styles.absolute, StyleSheet.absoluteFill]}>
          {starsLayer.map((star, index) => (
            <View key={index} style={[styles.absolute, star.style]}>
              {star.icon}
            </View>
          ))}
        </View>
      )}
      {withConfetti && (
        <View pointerEvents="none" style={[styles.absolute, StyleSheet.absoluteFill]}>
          {confettiLayer.map((conf, index) => (
            <View key={index} style={[styles.absolute, conf.style, styles.confetti]} />
          ))}
        </View>
      )}

      <View
        pointerEvents="none"
        style={[
          styles.gridOverlay,
          {
            left: inset,
            top: inset,
            width,
            height,
          },
        ]}
      >
        {verticalLines.map((_, index) => (
          <View key={`v-${index}`} style={[styles.gridLineVertical, { left: index * gridSize }]} />
        ))}
        {horizontalLines.map((_, index) => (
          <View key={`h-${index}`} style={[styles.gridLineHorizontal, { top: index * gridSize }]} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gridOverlay: {
    position: "absolute",
    opacity: 0.12,
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Palette.white,
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Palette.white,
  },
  absolute: {
    position: "absolute",
  },
  confetti: {
    borderRadius: 2,
  },
});
