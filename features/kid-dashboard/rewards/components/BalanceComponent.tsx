import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { IconType } from "@/lib/types";

import { IconLabel } from "../../home/components/IconLabel";

export default function BalanceComponent({ coins, xp }: { coins: number; xp: number }) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    text: {
      color: colors.white,
    },
  });

  return (
    <ThemedView child style={styles.balanceWrapper}>
      <View style={globalStyles.rowBetween}>
        <View style={styles.balance}>
          <IconLabel
            backgroundColor={colors.yellow}
            icon={<AppIcon icon={Icons.wallet} color={colors.darkNavy} />}
          />
          <ThemedText mono style={[dynamicStyles.text, styles.balanceText]}>
            {t("kid.rewards.yourBalance")}
          </ThemedText>
        </View>
        <Badge icon={Icons.coins} text={String(coins)} color={colors.yellow} />
      </View>

      <View style={globalStyles.rowBetween}>
        <InfoWrapper
          icon={Icons.coins}
          text={`${coins} ${t("common.coins")}`}
          color={colors.yellow}
        />
        <InfoWrapper icon={Icons.lightning} text={`${xp} ${t("common.xp")}`} color={colors.blue} />
      </View>
    </ThemedView>
  );
}

function InfoWrapper({ color, icon, text }: { color: string; icon: IconType; text: string }) {
  const colors = useAppColors();

  return (
    <ThemedView child style={styles.blockWrapper}>
      <AppIcon icon={icon} size={18} color={color} />
      <ThemedText child style={[styles.text, { color: colors.white }]}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  balanceWrapper: {
    padding: 16,
    gap: 12,
  },
  balance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  blockWrapper: {
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 18,
    textTransform: "uppercase",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 800,
  },
});
