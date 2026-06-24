import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import { ButtonFooterProps } from "@/lib/types";

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
    paddingTop: 20,
  },
});
