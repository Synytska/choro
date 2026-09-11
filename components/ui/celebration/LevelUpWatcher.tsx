import { useEffect, useRef } from "react";

import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { getPetStage } from "@/features/kid-dashboard/settings/utils";
import { selectAuthUserId } from "@/store/features/auth/selectors";
import { showLevelUp, showPetGrown } from "@/store/features/celebration/celebrationSlice";
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

      const previousStage = getPetStage(previousLevelRef.current);
      const nextStage = getPetStage(currentLevel);

      dispatch(
        showLevelUp({
          childId,
          previousLevel: previousLevelRef.current,
          nextLevel: currentLevel,
        }),
      );

      if (previousStage !== nextStage) {
        dispatch(
          showPetGrown({
            childId,
            nextLevel: currentLevel,
            nextStage,
            previousStage,
          }),
        );
      }
    }

    previousLevelRef.current = currentLevel;
  }, [childId, currentLevel, dispatch]);

  return null;
}
