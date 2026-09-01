import { QueryClient } from "@tanstack/react-query";

import { notificationsApi } from "@/features/notifications/api/notifications.api";
import { logger } from "@/lib/logger";
import { ChildDetailsData } from "@/lib/types";
import { showLevelUp } from "@/store/features/celebration/celebrationSlice";
import { useAppDispatch } from "@/store/hooks";

import { getPetStage } from "../../settings/utils";

const getKidDashboardQueryKey = (childId: string) => ["kid", "dashboard", childId] as const;

const getCachedLevel = (queryClient: QueryClient, childId: string) =>
  queryClient.getQueryData<ChildDetailsData | null>(getKidDashboardQueryKey(childId))?.child?.level;

export function useLevelUpCelebration() {
  const dispatch = useAppDispatch();

  const captureLevel = (queryClient: QueryClient, childId?: string | null) => {
    if (!childId) return null;

    return getCachedLevel(queryClient, childId) ?? null;
  };

  const showIfLevelIncreased = ({
    childId,
    loginCode,
    previousLevel,
    queryClient,
  }: {
    childId?: string | null;
    loginCode?: string | null;
    previousLevel: number | null;
    queryClient: QueryClient;
  }) => {
    if (!childId || previousLevel === null) return;

    const nextLevel = getCachedLevel(queryClient, childId);

    if (!nextLevel || nextLevel <= previousLevel) return;

    const previousStage = getPetStage(previousLevel);
    const nextStage = getPetStage(nextLevel);

    dispatch(
      showLevelUp({
        childId,
        previousLevel,
        nextLevel,
      }),
    );

    if (previousStage === nextStage) return;

    notificationsApi
      .sendChildPetGrownNotification({
        childId,
        loginCode,
        nextLevel,
        nextStage,
        previousLevel,
        previousStage,
      })
      .catch((error) => {
        logger.error("Child pet grown notification error:", error);
      });
  };

  return {
    captureLevel,
    showIfLevelIncreased,
  };
}
