import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { EditChildModal } from "@/features/parent-dashboard/children/components/modals/EditChildModalUi";
import { useChildDetails } from "@/features/parent-dashboard/children/hooks/useChildDetails";

export default function EditChildModalRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useChildDetails(id);

  return (
    <ThemedView style={styles.wrapper}>
      <EditChildModal data={data} isLoading={isLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
