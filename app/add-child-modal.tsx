import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import AddChildModalUI from "@/features/parent-dashboard/children/components/modals/AddChildModalUI";

export default function AddChildModal() {
  return (
    <ThemedView style={styles.wrapper}>
      <AddChildModalUI />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
