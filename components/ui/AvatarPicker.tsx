import { Image } from "expo-image";
import { ListRenderItem, Pressable, StyleSheet, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { ChildAvatarOption } from "@/lib/types";

import { CustomFlatList } from "../FlatList";
import { ThemedText } from "../themed-text";

type AvatarPickerProps = {
  title: string;
  data: ChildAvatarOption[];
  selectedAvatarId: string;
  onPress: (value: string) => void;
  disabled?: boolean;
};

export function AvatarPicker({
  title,
  data,
  selectedAvatarId,
  onPress,
  disabled,
}: AvatarPickerProps) {
  const colors = useAppColors();

  const renderIcon: ListRenderItem<ChildAvatarOption> = ({ item }) => {
    const isSelected = item.id === selectedAvatarId;

    return (
      <Pressable
        onPress={() => onPress(item.id)}
        disabled={disabled}
        style={[
          styles.icon,
          {
            backgroundColor: isSelected ? colors.white : colors.lightGrey,
            borderColor: isSelected ? colors.orange : colors.middleGrey,
          },
        ]}
      >
        <Image source={item.avatar} style={styles.avatarImage} contentFit="cover" />
      </Pressable>
    );
  };

  return (
    <View style={styles.iconContainer}>
      <ThemedText style={styles.iconText}>{title}</ThemedText>
      <CustomFlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={styles.iconsWrapper}
        renderItem={renderIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    gap: 12,
  },
  iconText: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 15,
    marginLeft: 4,
  },
  iconsWrapper: {
    gap: 8,
  },
  icon: {
    borderRadius: 50,
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
});
