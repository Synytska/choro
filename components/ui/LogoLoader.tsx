/**
 * Branded loading indicator based on LogoSmall.
 *
 * Props:
 * - size: rendered logo size.
 * - duration: full rotation duration in milliseconds.
 * - textColor/dotColor: optional logo color overrides.
 * - style: wrapper style.
 */
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { Palette } from "@/constants/theme";

type LogoLoaderProps = {
  size?: number;
  duration?: number;
  textColor?: string;
  dotColor?: string;
  style?: StyleProp<ViewStyle>;
};

const LOGO_VIEW_BOX_SIZE = 48;
const LOGO_C_PATH =
  "M32.4853 32.4853C30.8071 34.1635 28.6689 35.3064 26.3411 35.7694C24.0133 36.2324 21.6005 35.9948 19.4078 35.0866C17.2151 34.1783 15.3409 32.6402 14.0224 30.6668C12.7038 28.6935 12 26.3734 12 24C12 21.6266 12.7038 19.3065 14.0224 17.3332C15.3409 15.3598 17.2151 13.8217 19.4078 12.9134C21.6005 12.0052 24.0133 11.7676 26.3411 12.2306C28.6689 12.6936 30.8071 13.8365 32.4853 15.5147";

export function LogoLoader({
  size = 64,
  duration = 1100,
  textColor,
  dotColor,
  style,
}: LogoLoaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const logoTextColor = textColor ?? Palette.darkNavy;
  const logoDotColor = dotColor ?? Palette.logoDotRed;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [duration, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[styles.wrapper, { width: size, height: size }, style]}
    >
      <Svg
        fill="none"
        width={size}
        height={size}
        viewBox={`0 0 ${LOGO_VIEW_BOX_SIZE} ${LOGO_VIEW_BOX_SIZE}`}
      >
        <Rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke={logoTextColor} />
        <Circle cx="24" cy="24" r="3.5" fill={logoDotColor} />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[styles.rotatingLayer, { transform: [{ rotate: spin }] }]}
      >
        <Svg
          fill="none"
          width={size}
          height={size}
          viewBox={`0 0 ${LOGO_VIEW_BOX_SIZE} ${LOGO_VIEW_BOX_SIZE}`}
        >
          <Path d={LOGO_C_PATH} stroke={logoTextColor} strokeWidth="4" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  rotatingLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
