import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedText } from "../themed-text";

type IconPicker = {
  title: string;
  data: string[];
  selectedIcon: string;
  onPress: (value: string) => void;
  disabled?: boolean;
};

export function IconPicker({ title, data, selectedIcon, onPress, disabled }: IconPicker) {
  const colors = useAppColors();

  const renderIcon: ListRenderItem<string> = ({ item }) => {
    const isSelected = item === selectedIcon;

    return (
      <Pressable
        onPress={() => onPress(item)}
        disabled={disabled}
        style={[
          styles.icon,
          {
            backgroundColor: isSelected ? colors.white : colors.lightGrey,
            borderColor: isSelected ? colors.orange : colors.middleGrey,
          },
        ]}
      >
        <Text>{item}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.iconContainer}>
      <ThemedText style={styles.iconText}>{title}</ThemedText>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={styles.iconsWrapper}
        renderItem={renderIcon}
        showsHorizontalScrollIndicator={false}
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
  },
});
