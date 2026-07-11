/**
 * Renders one or more bottom action buttons for PageView screens.
 *
 * Props:
 * - buttons: array of FooterButton configs with title, onPress, variant, disabled, and icon.
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { ButtonFooterProps } from "@/lib/types";

import { Button } from "./Button";

export default function ButtonsFooter({ buttons }: ButtonFooterProps) {
  const defaults = useMemo(
    () => ({
      buttons: buttons?.filter((bt) => bt != null) || [],
    }),
    [buttons],
  );
  return (
    <View style={styles.footer}>
      {defaults.buttons.map((bt, index) => {
        return (
          <Button
            key={`bt-container-${index}`}
            onPress={bt.onPress}
            disabled={bt.disabled}
            variant={bt.variant}
            icon={bt.icon}
          >
            {bt.title}
          </Button>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 10,
  },
});
