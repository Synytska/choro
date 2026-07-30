import { QueryClient } from "@tanstack/react-query";

import { ChildDetailsData } from "@/lib/types";
import { showLevelUp } from "@/store/features/celebration/celebrationSlice";
import { useAppDispatch } from "@/store/hooks";

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
    previousLevel,
    queryClient,
  }: {
    childId?: string | null;
    previousLevel: number | null;
    queryClient: QueryClient;
  }) => {
    if (!childId || previousLevel === null) return;

    const nextLevel = getCachedLevel(queryClient, childId);

    if (!nextLevel || nextLevel <= previousLevel) return;

    dispatch(
      showLevelUp({
        childId,
        previousLevel,
        nextLevel,
      }),
    );
  };

  return {
    captureLevel,
    showIfLevelIncreased,
  };
}
