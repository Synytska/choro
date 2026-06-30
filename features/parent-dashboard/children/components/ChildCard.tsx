import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";

import { parentStyles } from "../../styles";

type ChildCardType = {
  name: string;
  age: number;
  coins: number;
};

export function ChildCard({ name, age, coins }: ChildCardType) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <ThemedView style={parentStyles.card}>
      <View style={[styles.align, styles.gap16]}>
        <View style={[styles.avatar]}>
          <Image source={ChoroImages.kidAvatar} style={styles.avatarImage} contentFit="cover" />
        </View>

        <View>
          <ThemedText style={styles.name}>{name}</ThemedText>

          <View style={[styles.align, styles.gap16]}>
            <ThemedText type="subtitle">{t("p-dashboard.children.yearsOld", { age })}</ThemedText>
            <View style={[styles.align, styles.gap4]}>
              <AppIcon icon={Icons.coins} size={14} color={colors.orange} />
              <ThemedText type="subtitle" style={styles.text}>
                {t("p-dashboard.children.total", { amount: coins })}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.align, styles.gap4, styles.flexStart]}>
        <AppIcon icon={Icons.fireFlame} size={14} color={colors.logoDotRed} />
        {/* TODO: add real data */}
        <ThemedText style={styles.text}>
          {t("p-dashboard.children.daysLeft", { days: 12 })}
        </ThemedText>
      </View>
    </ThemedView>
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
  flexStart: {
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  text: {
    fontWeight: 600,
    fontSize: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
});
