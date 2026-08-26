import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";
import { useClaimLevelUpBonus } from "@/features/kid-dashboard/home/hooks/useClaimLevelUpBonus";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { buttonVariant, levelUpCoins } from "@/lib/constants";
import { selectCurrentCelebration } from "@/store/features/celebration/selectors";
import { useAppSelector } from "@/store/hooks";

import { ThemedText } from "../../themed-text";
import { Button } from "../Button";

export function LevelUpOverlay() {
  const { t } = useTranslation();
  const celebration = useAppSelector(selectCurrentCelebration);
  const claimLevelUpBonus = useClaimLevelUpBonus();
  const reduceMotion = useReducedMotionPreference();
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!celebration || celebration.type !== "levelUp") return;

    scale.setValue(reduceMotion ? 1 : 0.88);
    opacity.setValue(0);

    Animated.parallel([
      reduceMotion
        ? Animated.timing(scale, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          })
        : Animated.spring(scale, {
            toValue: 1,
            friction: 6,
            tension: 90,
            useNativeDriver: true,
          }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: reduceMotion ? 80 : 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [celebration, opacity, reduceMotion, scale]);

  if (!celebration || celebration.type !== "levelUp") {
    return null;
  }

  const closeOverlay = () => {
    if (claimLevelUpBonus.isPending) return;

    claimLevelUpBonus.mutate({
      childId: celebration.childId,
      level: celebration.nextLevel,
    });
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable accessibilityRole="button" onPress={closeOverlay} style={styles.backdrop} />
      {!reduceMotion && (
        <View pointerEvents="none" style={styles.confetti}>
          <LottieView
            autoPlay
            loop={false}
            resizeMode="cover"
            source={require("@/assets/images/confetti.json")}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: Palette.darkNavy,
            borderColor: Palette.green,
            opacity,
            shadowColor: Palette.green,
            transform: [{ scale }],
          },
        ]}
      >
        <ThemedText child style={styles.eyebrow}>
          {t("kid.levelUpOverlay.title")}
        </ThemedText>

        <View style={styles.levelRow}>
          <ThemedText child style={styles.levelText}>
            {celebration.previousLevel}
          </ThemedText>
          <ThemedText child style={styles.arrow}>
            →
          </ThemedText>
          <ThemedText child style={[styles.levelText, { color: Palette.green }]}>
            {celebration.nextLevel}
          </ThemedText>
        </View>

        <ThemedText mono style={styles.subtitle}>
          {t("kid.levelUpOverlay.subtitle", { level: celebration.nextLevel })}
        </ThemedText>

        <Button
          variant={buttonVariant.secondary}
          onPress={closeOverlay}
          loading={claimLevelUpBonus.isPending}
          icon={<AppIcon icon={Icons.coins} size={18} color={Palette.darkNavy} />}
        >
          {t("kid.levelUpOverlay.getCoins", { coins: levelUpCoins })}
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.65,
    backgroundColor: Palette.black,
  },
  confetti: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    padding: 24,
    gap: 18,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    zIndex: 2,
  },
  eyebrow: {
    fontSize: 34,
    lineHeight: 36,
    textTransform: "uppercase",
    textAlign: "center",
    color: Palette.green,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  levelText: {
    fontSize: 72,
    lineHeight: 76,
    color: Palette.darkGrey,
  },
  arrow: {
    fontSize: 42,
    lineHeight: 46,
    color: Palette.yellow,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    color: Palette.white,
  },
});
