import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";
import { MultiSelectOption } from "@/lib/types";

import { AppIcon, Icons } from "./AppIcon";

type MultiSelectProps = {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  optionsContainerHeight?: number;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  hideSelectAllOption?: boolean;
  selectAllLabel?: string;
};

export function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  style,
  optionsContainerHeight,
  disabled,
  isOpen,
  onOpenChange,
  hideSelectAllOption = false,
  selectAllLabel,
}: MultiSelectProps) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [fieldHeight, setFieldHeight] = useState(56);
  const selectIsOpen = isOpen ?? uncontrolledIsOpen;

  const disabledColor = disabled ? colors.disabledGrey : colors.darkGrey;

  const setSelectIsOpen = (nextIsOpen: boolean) => {
    onOpenChange?.(nextIsOpen);

    if (isOpen === undefined) {
      setUncontrolledIsOpen(nextIsOpen);
    }
  };

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.id)),
    [options, selectedValues],
  );
  const allOptionIds = useMemo(() => options.map((option) => option.id), [options]);
  const allOptionsSelected =
    allOptionIds.length > 0 && allOptionIds.every((id) => selectedValues.includes(id));

  const toggleValue = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((item) => item !== id));
      return;
    }

    onChange([...selectedValues, id]);
  };

  const removeValue = (id: string) => {
    onChange(selectedValues.filter((item) => item !== id));
  };

  const removeAll = () => {
    onChange([]);
    setSelectIsOpen(false);
  };

  const toggleAll = () => {
    onChange(allOptionsSelected ? [] : allOptionIds);
    setUncontrolledIsOpen(false);
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={[styles.label, { color: colors.darkNavy }]}>{label}</Text>}

      <View style={styles.selectWrapper}>
        <Pressable
          onLayout={(event) => setFieldHeight(event.nativeEvent.layout.height)}
          onPress={() => setSelectIsOpen(!selectIsOpen)}
          disabled={disabled}
          style={[
            styles.field,
            {
              borderColor: selectIsOpen ? colors.orange : colors.middleGrey,
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

                  <Pressable onPress={() => removeValue(option.id)} hitSlop={8}>
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
              icon={selectIsOpen ? Icons.chevronUp : Icons.chevronDown}
              size={20}
              color={disabledColor}
            />
          </View>
        </Pressable>

        {selectIsOpen && (
          <View
            style={[
              styles.backdrop,
              {
                top: fieldHeight + 4,
                borderColor: colors.orange,
                backgroundColor: colors.white,
                height: optionsContainerHeight || 140,
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsContent}
            >
              {!hideSelectAllOption && (
                <View>
                  <Pressable style={styles.option} onPress={toggleAll} hitSlop={8}>
                    <Text style={[styles.optionText, { fontWeight: 700 }]}>
                      {selectAllLabel ?? t("common.selectAll")}
                    </Text>

                    {allOptionsSelected && (
                      <AppIcon icon={Icons.check} size={18} color={colors.orange} />
                    )}
                  </Pressable>
                  {options.length > 0 && (
                    <View style={[styles.divider, { borderColor: colors.middleGrey }]} />
                  )}
                </View>
              )}

              {options.map((item, index) => {
                const selected = selectedValues.includes(item.id);

                return (
                  <View key={item.id}>
                    <Pressable
                      style={styles.option}
                      onPress={() => toggleValue(item.id)}
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
