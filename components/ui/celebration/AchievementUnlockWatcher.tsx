import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { notificationsApi } from "@/features/notifications/api/notifications.api";
import { logger } from "@/lib/logger";
import {
  selectAuthUserId,
  selectAuthUserLoginCode,
  selectAuthUserRole,
} from "@/store/features/auth/selectors";
import { useAppSelector } from "@/store/hooks";

export function AchievementUnlockWatcher() {
  const queryClient = useQueryClient();
  const childId = useAppSelector(selectAuthUserId);
  const loginCode = useAppSelector(selectAuthUserLoginCode);
  const authRole = useAppSelector(selectAuthUserRole);
  const { data } = useKidDashboard();
  const inFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (authRole !== "kid" || !childId || !loginCode) return;

    const achievement = data?.childAchievements?.find(
      (item) => !item.shownAt && !item.claimedAt && !inFlightIdsRef.current.has(item.achievementId),
    );

    if (!achievement) return;

    inFlightIdsRef.current.add(achievement.achievementId);

    notificationsApi
      .sendChildAchievementUnlockedNotification({
        achievementId: achievement.achievementId,
        childId,
        loginCode,
      })
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: ["kid", "dashboard", childId],
        }),
      )
      .catch((error) => {
        inFlightIdsRef.current.delete(achievement.achievementId);
        logger.error("Child achievement unlocked notification error:", error);
      });
  }, [authRole, childId, data?.childAchievements, loginCode, queryClient]);

  return null;
}
