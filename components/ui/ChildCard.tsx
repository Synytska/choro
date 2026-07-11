import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildCard } from "@/lib/types";
import { getInitials } from "@/lib/utils/utils";

type RewardCardComponentProps = {
  item: ChildCard;
  onPress: () => void;
  isSelected: boolean;
};

export function ChildCardComponent({ item, onPress, isSelected }: RewardCardComponentProps) {
  const colors = useAppColors();

  const initials = getInitials(item.name);

  const dynamicStyles = StyleSheet.create({
    selectedTab: {
      backgroundColor: colors.orange,
    },
    tab: {
      borderWidth: 0.3,
      borderColor: colors.orange,
    },
  });

  return (
    <TouchableOpacity
      key={item.id}
      onPress={onPress}
      style={[
        styles.tab,
        dynamicStyles.tab,
        globalStyles.shadow,
        isSelected && dynamicStyles.selectedTab,
      ]}
    >
      <ThemedText style={styles.tabText}>{initials}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    borderRadius: 40,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontWeight: 700,
    fontSize: 14,
  },
});
