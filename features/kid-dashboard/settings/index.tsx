import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { scrollViewTopKid } from "@/lib/constants";

export default function ChildrenSettingsUI() {
  return (
    <ChildWrapper>
      <CustomScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <ThemedText>Settings</ThemedText>
      </CustomScrollView>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    zIndex: 100,
  },
  container: {
    marginTop: scrollViewTopKid,
    gap: 20,
  },
});
