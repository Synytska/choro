import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

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
  const { height: windowHeight } = useWindowDimensions();
  const background = useThemeColor({}, "background");
  const disabledBackground = useThemeColor({}, "disabled");
  const disabledText = useThemeColor({}, "disabledText");
  const disabledColor = disabled ? disabledText : Palette.darkGrey;
  const disabledBorder = disabled ? disabledText : Palette.middleGrey;

  const fieldRef = useRef<View>(null);
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [fieldHeight, setFieldHeight] = useState(56);
  const [dropdownLayout, setDropdownLayout] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: optionsContainerHeight || 180,
  });
  const selectIsOpen = isOpen ?? uncontrolledIsOpen;

  const setSelectIsOpen = (nextIsOpen: boolean) => {
    if (nextIsOpen) {
      fieldRef.current?.measureInWindow((left, top, width, height) => {
        const preferredHeight = optionsContainerHeight || 180;
        const belowTop = top + height + 4;
        const availableBelow = windowHeight - belowTop - 16;
        const availableAbove = top - 16;
        const opensAbove = availableBelow < 96 && availableAbove > availableBelow;
        const maxHeight = Math.max(
          96,
          Math.min(preferredHeight, opensAbove ? availableAbove : availableBelow),
        );

        setFieldHeight(height);
        setDropdownLayout({
          top: opensAbove ? top - maxHeight - 4 : belowTop,
          left,
          width,
          maxHeight,
        });
      });
    }

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
    setSelectIsOpen(false);
  };

  const optionsList = (
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

            {allOptionsSelected && <AppIcon icon={Icons.check} size={18} color={Palette.orange} />}
          </Pressable>
          {options.length > 0 && <View style={styles.divider} />}
        </View>
      )}

      {options.map((item, index) => {
        const selected = selectedValues.includes(item.id);

        return (
          <View key={item.id}>
            <Pressable style={styles.option} onPress={() => toggleValue(item.id)} hitSlop={8}>
              <ThemedText style={styles.optionText}>{item.label}</ThemedText>

              {selected && <AppIcon icon={Icons.check} size={18} color={Palette.orange} />}
            </Pressable>
            {index !== options.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </CustomScrollView>
  );

  return (
    <View style={[styles.wrapper, style]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View ref={fieldRef} collapsable={false} style={styles.selectWrapper}>
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
      </View>

      <Modal
        visible={selectIsOpen}
        transparent
        animationType="none"
        onRequestClose={() => setSelectIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectIsOpen(false)}>
          <Pressable
            style={[
              styles.backdrop,
              {
                top: dropdownLayout.top || fieldHeight + 4,
                left: dropdownLayout.left,
                width: dropdownLayout.width || "100%",
                maxHeight: dropdownLayout.maxHeight,
                backgroundColor: background,
              },
            ]}
          >
            {optionsList}
          </Pressable>
        </Pressable>
      </Modal>
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
    zIndex: 1,
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
    borderWidth: 1,
    borderRadius: 12,
    position: "absolute",
    zIndex: 1000,
    elevation: 24,
    overflow: "hidden",
    borderColor: Palette.orange,
    shadowColor: Palette.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  modalOverlay: {
    flex: 1,
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
