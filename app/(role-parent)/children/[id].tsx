import { useLocalSearchParams } from "expo-router";

import { ChildSummaryScreen } from "@/features/parent-dashboard/children/components/child_summary";
import { useChildDetails } from "@/features/parent-dashboard/children/hooks/useChildDetails";

export default function ParentChildDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useChildDetails(id);

  return <ChildSummaryScreen data={data} isLoading={isLoading} />;
}
