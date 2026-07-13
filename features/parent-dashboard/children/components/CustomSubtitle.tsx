import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

type CustomSubtitleType = {
  age: number;
  coins: number;
};

export function CustomSubtitle({ age, coins }: CustomSubtitleType) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <View style={[styles.align, styles.gap16]}>
      <ThemedText type="subtitle">{t("parent.children.yearsOld", { age })}</ThemedText>
      <View style={[styles.align, styles.gap4]}>
        <AppIcon icon={Icons.coins} size={14} color={colors.orange} />
        <ThemedText type="subtitle" style={styles.text}>
          {t("parent.children.total", { amount: coins })}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  align: {
    flexDirection: "row",
    alignItems: "center",
  },
  gap16: {
    gap: 16,
  },
  gap4: {
    gap: 4,
  },
  text: {
    fontWeight: 600,
    fontSize: 14,
  },
});
