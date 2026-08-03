import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MultiSelectOption } from "@/lib/types";

import { ThemedText } from "../themed-text";
import { AppIcon, Icons } from "./AppIcon";
import { CustomScrollView } from "./ScrollView";

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
  const { t } = useTranslation();
  const background = useThemeColor({}, "background");
  const disabledBackground = useThemeColor({}, "disabled");
  const disabledText = useThemeColor({}, "disabledText");
  const disabledColor = disabled ? disabledText : Palette.darkGrey;
  const disabledBorder = disabled ? disabledText : Palette.middleGrey;

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [fieldHeight, setFieldHeight] = useState(56);
  const selectIsOpen = isOpen ?? uncontrolledIsOpen;

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
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View style={styles.selectWrapper}>
        <Pressable
          onLayout={(event) => setFieldHeight(event.nativeEvent.layout.height)}
          onPress={() => setSelectIsOpen(!selectIsOpen)}
          disabled={disabled}
          style={[
            styles.field,
            {
              borderColor: selectIsOpen ? Palette.orange : disabledBorder,
              backgroundColor: background,
            },
            disabled && { backgroundColor: disabledBackground },
          ]}
        >
          <View style={styles.chips}>
            {selectedOptions.length ? (
              selectedOptions.map((option) => (
                <View
                  key={option.value}
                  style={[styles.chip, { backgroundColor: Palette.lightGrey }]}
                >
                  <Text style={[styles.chipText, { color: Palette.darkNavy }]}>{option.value}</Text>

                  <Pressable onPress={() => removeValue(option.id)} hitSlop={8}>
                    <AppIcon icon={Icons.close} size={14} color={Palette.darkGrey} />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={[styles.placeholder, { color: disabledColor }]}>{placeholder}</Text>
            )}
          </View>
          <View style={styles.iconsWrapper}>
            <Pressable onPress={removeAll}>
              <AppIcon icon={Icons.close} size={18} color={disabledColor} />
            </Pressable>

            <View style={[styles.separator, { backgroundColor: disabledColor }]} />
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
                backgroundColor: background,
                height: optionsContainerHeight || 140,
              },
            ]}
          >
            <CustomScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsContent}
            >
              {!hideSelectAllOption && (
                <View>
                  <Pressable style={styles.option} onPress={toggleAll} hitSlop={8}>
                    <ThemedText style={[styles.optionText, { fontWeight: 700 }]}>
                      {selectAllLabel ?? t("common.selectAll")}
                    </ThemedText>

                    {allOptionsSelected && (
                      <AppIcon icon={Icons.check} size={18} color={Palette.orange} />
                    )}
                  </Pressable>
                  {options.length > 0 && <View style={styles.divider} />}
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
                      <ThemedText style={styles.optionText}>{item.label}</ThemedText>

                      {selected && <AppIcon icon={Icons.check} size={18} color={Palette.orange} />}
                    </Pressable>
                    {index !== options.length - 1 && <View style={styles.divider} />}
                  </View>
                );
              })}
            </CustomScrollView>
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
    lineHeight: 14,
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
    borderColor: Palette.orange,
  },
  optionsContent: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    paddingTop: 6,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 32,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 16,
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
    borderColor: Palette.middleGrey,
  },
});
