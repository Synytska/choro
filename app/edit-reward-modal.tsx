import { useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { EditRewardModalUI } from "@/features/parent-dashboard/rewards/components/EditRewardModalUI";
import { useRewardDetails } from "@/features/parent-dashboard/rewards/hooks/useRewardDetails";

export default function EditRewardModal() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>();
  const { data, isLoading } = useRewardDetails(rewardId);

  return (
    <ScreenContainer>
      <EditRewardModalUI rewardId={rewardId} data={data} isLoading={isLoading} />
    </ScreenContainer>
  );
}
