import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildCard } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

type ChildTabsComponentProps = {
  item: ChildCard;
  onPress: () => void;
  isSelected: boolean;
};

export function ChildTabsComponent({ item, onPress, isSelected }: ChildTabsComponentProps) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    selectedTab: {
      borderColor: colors.orange,
      opacity: 0.4,
    },
    tab: {
      borderWidth: 1,
      borderColor: colors.middleGrey,
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
      <Image
        source={getChildAvatarImage(item.avatarId, item.avatarUrl)}
        style={styles.avatar}
        contentFit="cover"
      />
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
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
