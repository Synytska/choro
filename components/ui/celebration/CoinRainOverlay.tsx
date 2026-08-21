import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, useWindowDimensions, View } from "react-native";

import { ChoroImages } from "@/assets/images";

type CoinRainOverlayProps = {
  active: boolean;
  onFinish?: () => void;
};

const COIN_COUNT = 18;

export function CoinRainOverlay({ active, onFinish }: CoinRainOverlayProps) {
  const { width, height } = useWindowDimensions();
  const animatedValues = useRef(
    Array.from({ length: COIN_COUNT }, () => new Animated.Value(0)),
  ).current;

  const coins = useMemo(
    () =>
      Array.from({ length: COIN_COUNT }, (_, index) => {
        const column = index % 6;
        const row = Math.floor(index / 6);
        const horizontalOffset = ((index * 37) % 64) - 32;

        return {
          id: `coin-${index}`,
          size: 30 + ((index * 7) % 18),
          left: width * 0.08 + column * (width * 0.16) + horizontalOffset,
          startY: -80 - row * 38,
          endY: height * 0.72 + ((index * 29) % 120),
          rotate: index % 2 === 0 ? "520deg" : "-460deg",
        };
      }),
    [height, width],
  );

  useEffect(() => {
    if (!active) return;

    animatedValues.forEach((value) => value.setValue(0));

    const animations = animatedValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 900 + (index % 5) * 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );

    Animated.stagger(38, animations).start(({ finished }) => {
      if (finished) {
        onFinish?.();
      }
    });
  }, [active, animatedValues, onFinish]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {coins.map((coin, index) => {
        const progress = animatedValues[index];
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [coin.startY, coin.endY],
        });
        const translateX = progress.interpolate({
          inputRange: [0, 0.45, 1],
          outputRange: [0, index % 2 === 0 ? 28 : -28, index % 3 === 0 ? -16 : 16],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", coin.rotate],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.08, 0.82, 1],
          outputRange: [0, 1, 1, 0],
        });
        const scale = progress.interpolate({
          inputRange: [0, 0.18, 1],
          outputRange: [0.55, 1.12, 0.82],
        });

        return (
          <Animated.View
            key={coin.id}
            style={[
              styles.coinWrapper,
              {
                left: coin.left,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }, { scale }],
              },
            ]}
          >
            <Image
              source={ChoroImages.coin}
              resizeMode="contain"
              style={{ width: coin.size, height: coin.size }}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 100,
  },
  coinWrapper: {
    position: "absolute",
    top: 0,
  },
});
