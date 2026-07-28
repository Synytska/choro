import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

import ConfirmTaskUI from "@/features/kid-dashboard/home/components/ConfirmTask";
import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";

export default function ConfirmTask() {
  const { id, color } = useLocalSearchParams<{ id: string; color?: string }>();
  const { data: dashboardData } = useKidDashboard();
  const task = useMemo(
    () => dashboardData?.tasks.find((dashboardTask) => dashboardTask.id === id),
    [dashboardData?.tasks, id],
  );

  return <ConfirmTaskUI task={task} color={color} />;
}
