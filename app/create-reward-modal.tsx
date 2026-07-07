import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { CreateRewardModalUI } from "@/features/parent-dashboard/rewards/components/CreateRewardModalUI";

export default function CreateRewardModal() {
  return (
    <ThemedView style={styles.wrapper}>
      <CreateRewardModalUI />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
