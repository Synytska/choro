import { ReactNode } from "react";
import { ListRenderItem, Pressable, StyleSheet, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { CustomFlatList } from "../FlatList";
import { ThemedText } from "../themed-text";

type SelectablePickerProps<TItem> = {
  title: string;
  data: TItem[];
  selectedValue: string;
  getKey: (item: TItem) => string;
  onSelect: (value: string) => void;
  renderOption: (item: TItem) => ReactNode;
  disabled?: boolean;
  clipContent?: boolean;
};

export function SelectablePicker<TItem>({
  title,
  data,
  selectedValue,
  getKey,
  onSelect,
  renderOption,
  disabled,
  clipContent = false,
}: SelectablePickerProps<TItem>) {
  const colors = useAppColors();

  const renderItem: ListRenderItem<TItem> = ({ item }) => {
    const value = getKey(item);
    const isSelected = value === selectedValue;

    return (
      <Pressable
        onPress={() => onSelect(value)}
        disabled={disabled}
        style={[
          styles.option,
          clipContent && styles.clippedOption,
          {
            backgroundColor: isSelected ? colors.white : colors.lightGrey,
            borderColor: isSelected ? colors.orange : colors.middleGrey,
          },
          disabled && styles.disabled,
        ]}
      >
        {renderOption(item)}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <CustomFlatList
        data={data}
        keyExtractor={(item) => getKey(item as TItem)}
        horizontal
        contentContainerStyle={styles.optionsWrapper}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 15,
    marginLeft: 4,
  },
  optionsWrapper: {
    gap: 8,
  },
  option: {
    borderRadius: 50,
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  clippedOption: {
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
    borderWidth: 0,
  },
});
