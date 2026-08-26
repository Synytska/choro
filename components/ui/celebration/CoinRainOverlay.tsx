import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, useWindowDimensions, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

type CoinRainOverlayProps = {
  active: boolean;
  amount?: number;
  onFinish?: () => void;
};

const COIN_COUNT = 18;
const REDUCED_MOTION_COIN_COUNT = 8;

export function CoinRainOverlay({ active, amount, onFinish }: CoinRainOverlayProps) {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotionPreference();
  const animatedValues = useRef(
    Array.from({ length: COIN_COUNT }, () => new Animated.Value(0)),
  ).current;
  const coinCount = reduceMotion ? REDUCED_MOTION_COIN_COUNT : COIN_COUNT;

  const coins = useMemo(
    () =>
      Array.from({ length: coinCount }, (_, index) => {
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
    [coinCount, height, width],
  );

  useEffect(() => {
    if (!active) return;

    animatedValues.forEach((value) => value.setValue(0));

    const activeValues = animatedValues.slice(0, coinCount);
    const animations = activeValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: reduceMotion ? 420 : 900 + (index % 5) * 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );

    Animated.stagger(reduceMotion ? 18 : 38, animations).start(({ finished }) => {
      if (finished) {
        onFinish?.();
      }
    });
  }, [active, animatedValues, coinCount, onFinish, reduceMotion]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {typeof amount === "number" && amount > 0 ? (
        <View style={styles.amountBadge}>
          <Image source={ChoroImages.coin} resizeMode="contain" style={styles.amountCoin} />
          <ThemedText child style={styles.amountText}>
            +{amount}
          </ThemedText>
        </View>
      ) : null}

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
  amountBadge: {
    position: "absolute",
    top: "18%",
    alignSelf: "center",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Palette.yellow,
    borderRadius: 999,
    backgroundColor: Palette.darkNavy,
  },
  amountCoin: {
    width: 26,
    height: 26,
  },
  amountText: {
    color: Palette.yellow,
    fontSize: 30,
    lineHeight: 32,
  },
});
