import { useLocalSearchParams } from "expo-router";

import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { EditChildModal } from "@/features/parent-dashboard/children/components/modals/EditChildModalUi";
import { useChildDetails } from "@/features/parent-dashboard/children/hooks/useChildDetails";

export default function EditChildModalRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useChildDetails(id);

  return (
    <ScreenContainer>
      <EditChildModal data={data} isLoading={isLoading} />
    </ScreenContainer>
  );
}
