import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { ChildCard } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

type ChildTabsComponentProps = {
  item: ChildCard;
  onPress: () => void;
  isSelected: boolean;
};

export function ChildTabsComponent({ item, onPress, isSelected }: ChildTabsComponentProps) {
  return (
    <TouchableOpacity
      key={item.id}
      onPress={onPress}
      style={[styles.tab, globalStyles.shadow, isSelected && styles.selectedTab]}
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
    borderWidth: 1,
    borderColor: Palette.middleGrey,
    opacity: 0.4,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  selectedTab: {
    borderColor: Palette.orange,
    opacity: 1,
  },
});
