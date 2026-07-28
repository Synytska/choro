/**
 * Reusable segmented toggle used to switch between small view modes or filters.
 *
 * Props:
 * - tabs: visible toggle options with icon, title and typed value.
 * - activeTab: currently selected value.
 * - onChange: called with the selected tab value.
 */
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { TabItem } from "@/lib/types";

type ToggleBarProps<TValue extends string> = {
  tabs: TabItem<TValue>[];
  activeTab: TValue;
  onChange: (value: TValue) => void;
};

export function ToggleBar<TValue extends string>({
  tabs,
  activeTab,
  onChange,
}: ToggleBarProps<TValue>) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    segmentActive: {
      backgroundColor: colors.green,
      shadowColor: colors.green,
    },
    segmentInactive: {
      color: colors.darkGrey,
    },
    segmentActiveText: {
      color: colors.black,
    },
  });

  return (
    <ThemedView child style={styles.toggleBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={[
              styles.segment,
              isActive && [dynamicStyles.segmentActive, globalStyles.kidShadow],
            ]}
          >
            <AppIcon icon={tab.icon} size={14} color={colors.darkGrey} />
            <ThemedText
              mono
              style={[
                styles.segmentInactive,
                dynamicStyles.segmentInactive,
                isActive && dynamicStyles.segmentActiveText,
              ]}
            >
              {tab.title}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  toggleBar: {
    flexDirection: "row",
    padding: 6,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    gap: 8,
  },
  segmentInactive: {
    fontSize: 14,
    lineHeight: 15,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
