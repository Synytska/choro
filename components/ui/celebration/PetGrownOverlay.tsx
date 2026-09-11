import { useSegments } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { hidePetGrown } from "@/store/features/celebration/celebrationSlice";
import { selectPetGrownCelebration } from "@/store/features/celebration/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const DISPLAY_DURATION = 2200;

export function PetGrownOverlay() {
  const { t } = useTranslation();
  const segments = useSegments();
  const routeSegments = segments as readonly string[];
  const dispatch = useAppDispatch();
  const celebration = useAppSelector(selectPetGrownCelebration);
  const reduceMotion = useReducedMotionPreference();
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const isKidPetRoute =
    routeSegments.includes("(role-kid)") && routeSegments.includes("(settings)");

  useEffect(() => {
    if (!celebration || !isKidPetRoute) return;

    translateY.setValue(reduceMotion ? 0 : -24);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: reduceMotion ? 80 : 180,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: reduceMotion ? 80 : 220,
        useNativeDriver: true,
      }).start(() => dispatch(hidePetGrown()));
    }, DISPLAY_DURATION);

    return () => clearTimeout(timeout);
  }, [celebration, dispatch, isKidPetRoute, opacity, reduceMotion, translateY]);

  if (!celebration || !isKidPetRoute) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {!reduceMotion && (
        <LottieView
          autoPlay
          loop={false}
          resizeMode="cover"
          source={require("@/assets/images/confetti.json")}
          style={StyleSheet.absoluteFill}
        />
      )}

      <Animated.View
        style={[
          styles.badge,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <ThemedText child style={styles.title}>
          {t("kid.petGrownOverlay.title")}
        </ThemedText>
        <ThemedText mono style={styles.subtitle}>
          {t("kid.petGrownOverlay.subtitle", {
            level: celebration.nextLevel,
            stage: t(`kid.settings.pet.stages.${celebration.nextStage}`),
          })}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 82,
    zIndex: 1100,
  },
  badge: {
    width: "100%",
    maxWidth: 360,
    gap: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Palette.green,
    borderRadius: 20,
    backgroundColor: Palette.darkNavy,
    shadowColor: Palette.green,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    color: Palette.green,
    fontSize: 26,
    lineHeight: 28,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    color: Palette.white,
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
});
