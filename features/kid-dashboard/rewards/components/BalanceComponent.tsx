import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { textType } from "@/lib/constants";
import { IconType } from "@/lib/types";

import { IconLabel } from "../../home/components/IconLabel";

export default function BalanceComponent({ coins, xp }: { coins: number; xp: number }) {
  const { t } = useTranslation();

  return (
    <ThemedView child style={styles.balanceWrapper}>
      <View style={globalStyles.rowBetween}>
        <View style={styles.balance}>
          <IconLabel
            backgroundColor={Palette.yellow}
            icon={<AppIcon icon={Icons.wallet} color={Palette.darkNavy} />}
          />
          <ThemedText type={textType.subtitleChild} style={styles.balanceText}>
            {t("kid.rewards.yourBalance")}
          </ThemedText>
        </View>
        <Badge icon={Icons.coins} text={String(coins)} color={Palette.yellow} />
      </View>

      <View style={globalStyles.rowBetween}>
        <InfoWrapper
          icon={Icons.coins}
          text={`${coins} ${t("common.coins")}`}
          color={Palette.yellow}
        />
        <InfoWrapper icon={Icons.lightning} text={`${xp} ${t("common.xp")}`} color={Palette.blue} />
      </View>
    </ThemedView>
  );
}

export function InfoWrapper({
  color,
  icon,
  text,
}: {
  color: string;
  icon: IconType;
  text: string;
}) {
  return (
    <ThemedView child style={styles.blockWrapper}>
      <AppIcon icon={icon} size={18} color={color} />
      <ThemedText child style={[styles.text, { color: color }]}>
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
    color: Palette.white,
  },
});
