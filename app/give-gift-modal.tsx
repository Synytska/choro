import { useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useChildDetails } from "@/features/parent-dashboard/children/hooks/useChildDetails";
import { GiveGiftModalUI } from "@/features/parent-dashboard/rewards/components/GiveGiftModalUI";
import { useRewardDetails } from "@/features/parent-dashboard/rewards/hooks/useRewardDetails";

export default function GiveGiftModalRoute() {
  const { childId, rewardId } = useLocalSearchParams<{ childId: string; rewardId: string }>();
  const { data: childDetails, isLoading: isChildLoading } = useChildDetails(childId);
  const { data: reward, isLoading: isRewardLoading } = useRewardDetails(rewardId);

  return (
    <ScreenContainer>
      <GiveGiftModalUI
        child={childDetails?.child}
        reward={reward}
        isLoading={isChildLoading || isRewardLoading}
      />
    </ScreenContainer>
  );
}
