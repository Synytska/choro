import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";

export default function ConfirmTask() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: dashboardData, isLoading } = useKidDashboard();
  const task = useMemo(
    () => dashboardData?.tasks.find((dashboardTask) => dashboardTask.id === id),
    [dashboardData?.tasks, id],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Confirm task</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
