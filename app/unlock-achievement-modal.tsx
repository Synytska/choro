import { useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { UnlockAchievementModalUI } from "@/features/kid-dashboard/rewards/components/UnlockAchievementModalUI";
import { useAchievementDetails } from "@/features/kid-dashboard/rewards/hooks/useAchievementDetails";

export default function UnlockAchievemntModalRoute() {
  const { achievementId } = useLocalSearchParams<{ achievementId?: string }>();
  const { achievement, childId, isLoading, loginCode } = useAchievementDetails(achievementId);

  return (
    <ScreenContainer>
      <UnlockAchievementModalUI
        achievement={achievement}
        childId={childId}
        isLoading={isLoading}
        loginCode={loginCode}
      />
    </ScreenContainer>
  );
}
