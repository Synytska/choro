import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { AppIcon, Icons } from "./AppIcon";

export type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  style,
  disabled,
}: MultiSelectProps) {
  const colors = useAppColors();

  const [isOpen, setIsOpen] = useState(false);
  const [fieldHeight, setFieldHeight] = useState(56);

  const disabledColor = disabled ? colors.disabledGrey : colors.darkGrey;

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues],
  );

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  const removeValue = (value: string) => {
    onChange(selectedValues.filter((item) => item !== value));
  };

  const removeAll = () => {
    onChange([]);
    setIsOpen(false);
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={[styles.label, { color: colors.darkNavy }]}>{label}</Text>}

      <View style={styles.selectWrapper}>
        <Pressable
          onLayout={(event) => setFieldHeight(event.nativeEvent.layout.height)}
          onPress={() => setIsOpen(!isOpen)}
          disabled={disabled}
          style={[
            styles.field,
            {
              borderColor: isOpen ? colors.orange : colors.middleGrey,
              backgroundColor: colors.white,
            },
            disabled && { backgroundColor: colors.lightGrey },
          ]}
        >
          <View style={styles.chips}>
            {selectedOptions.length ? (
              selectedOptions.map((option) => (
                <View
                  key={option.value}
                  style={[styles.chip, { backgroundColor: colors.lightGrey }]}
                >
                  <Text style={[styles.chipText, { color: colors.darkNavy }]}>{option.value}</Text>

                  <Pressable onPress={() => removeValue(option.value)} hitSlop={8}>
                    <AppIcon icon={Icons.close} size={14} color={colors.darkGrey} />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={[styles.placeholder, { color: colors.darkGrey }]}>{placeholder}</Text>
            )}
          </View>
          <View style={styles.iconsWrapper}>
            <Pressable onPress={removeAll}>
              <AppIcon icon={Icons.close} size={18} color={disabledColor} />
            </Pressable>

            <View style={[styles.separator, { backgroundColor: colors.middleGrey }]} />
            <AppIcon
              icon={isOpen ? Icons.chevronUp : Icons.chevronDown}
              size={20}
              color={disabledColor}
            />
          </View>
        </Pressable>

        {isOpen && (
          <View
            style={[
              styles.backdrop,
              {
                top: fieldHeight + 4,
                borderColor: colors.orange,
                backgroundColor: colors.white,
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsContent}
            >
              {options.map((item, index) => {
                const selected = selectedValues.includes(item.value);

                return (
                  <View key={item.value}>
                    <Pressable
                      style={styles.option}
                      onPress={() => toggleValue(item.value)}
                      hitSlop={8}
                    >
                      <Text style={[styles.optionText, { color: colors.darkNavy }]}>
                        {item.label}
                      </Text>

                      {selected && <AppIcon icon={Icons.check} size={18} color={colors.orange} />}
                    </Pressable>
                    {index !== options.length - 1 && (
                      <View style={[styles.divider, { borderColor: colors.middleGrey }]} />
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 4,
  },
  selectWrapper: {
    position: "relative",
    elevation: 100,
  },
  field: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    minHeight: 32,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  placeholder: {
    fontSize: 15,
    paddingVertical: 6,
  },
  backdrop: {
    maxHeight: 240,
    borderWidth: 1,
    borderRadius: 12,
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
    overflow: "hidden",
  },
  optionsContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 32,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    width: 1,
    height: "100%",
  },
  iconsWrapper: {
    flexDirection: "row",
    gap: 12,
    height: "100%",
    alignItems: "center",
  },
  divider: {
    borderWidth: 0.5,
  },
});
