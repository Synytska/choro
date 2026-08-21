import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotionPreference() {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (isMounted) {
        setIsReduceMotionEnabled(value);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setIsReduceMotionEnabled,
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return isReduceMotionEnabled;
}
