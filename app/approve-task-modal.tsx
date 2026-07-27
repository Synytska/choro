import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

import { ApproveTaskModalUI } from "@/components/ui/ApproveTaskModalUI";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { useChildDetails } from "@/features/parent-dashboard/children/hooks/useChildDetails";

export default function ApproveTaskModalRoute() {
  const { childId, taskId } = useLocalSearchParams<{ childId: string; taskId: string }>();
  const { data, isLoading } = useChildDetails(childId);
  const task = useMemo(() => data?.tasks.find((item) => item.id === taskId), [data?.tasks, taskId]);

  return (
    <ScreenContainer>
      <ApproveTaskModalUI child={data?.child} isLoading={isLoading} task={task} />
    </ScreenContainer>
  );
}
