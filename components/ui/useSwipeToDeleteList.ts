import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { SwipeToDeleteRef } from "./SwipeToDelete";

export function useSwipeToDeleteList() {
  const refs = useRef<Record<string, SwipeToDeleteRef | null>>({});
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const closeAllSwipeables = useCallback(() => {
    Object.values(refs.current).forEach((ref) => {
      ref?.close();
    });
  }, []);

  const handleSwipeOpen = useCallback((openedItemId: string) => {
    Object.entries(refs.current).forEach(([itemId, ref]) => {
      if (itemId !== openedItemId) {
        ref?.close();
      }
    });
  }, []);

  const setSwipeableRef = useCallback(
    (itemId: string) => (ref: SwipeToDeleteRef | null) => {
      refs.current[itemId] = ref;
    },
    [],
  );

  const handleSwipeStart = useCallback(() => {
    setIsScrollEnabled(false);
  }, []);

  const handleSwipeEnd = useCallback(() => {
    setIsScrollEnabled(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      closeAllSwipeables();
    }, [closeAllSwipeables]),
  );

  return {
    closeAllSwipeables,
    handleSwipeEnd,
    handleSwipeOpen,
    handleSwipeStart,
    isScrollEnabled,
    setSwipeableRef,
  };
}
