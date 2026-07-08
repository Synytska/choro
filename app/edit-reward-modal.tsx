import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { EditRewardModalUI } from "@/features/parent-dashboard/rewards/components/EditRewardModalUI";
import { useRewardDetails } from "@/features/parent-dashboard/rewards/hooks/useRewardDetails";

export default function EditRewardModal() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>();
  const { data, isLoading } = useRewardDetails(rewardId);

  return (
    <ThemedView style={styles.wrapper}>
      <EditRewardModalUI rewardId={rewardId} data={data} isLoading={isLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
