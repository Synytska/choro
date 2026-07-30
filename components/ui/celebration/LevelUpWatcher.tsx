import { useEffect, useRef } from "react";

import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { selectAuthUserId } from "@/store/features/auth/selectors";
import { showLevelUp } from "@/store/features/celebration/celebrationSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function LevelUpWatcher() {
  const dispatch = useAppDispatch();
  const childId = useAppSelector(selectAuthUserId);
  const { data } = useKidDashboard();
  const previousLevelRef = useRef<number | null>(null);
  const currentLevel = data?.child?.level;

  useEffect(() => {
    if (!currentLevel) return;

    if (previousLevelRef.current === null) {
      previousLevelRef.current = currentLevel;
      return;
    }

    if (currentLevel > previousLevelRef.current) {
      if (!childId) return;

      dispatch(
        showLevelUp({
          childId,
          previousLevel: previousLevelRef.current,
          nextLevel: currentLevel,
        }),
      );
    }

    previousLevelRef.current = currentLevel;
  }, [childId, currentLevel, dispatch]);

  return null;
}
