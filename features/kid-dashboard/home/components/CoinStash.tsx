import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Badge } from "@/components/ui/Badge";
import { Palette } from "@/constants/theme";
import { IconType } from "@/lib/types";

import { IconLabel } from "./IconLabel";

type CoinStashProps = {
  coinBalance?: number;
  xpTotal?: number;
};

export function CoinStash({ coinBalance = 0, xpTotal = 0 }: CoinStashProps) {
  const { t } = useTranslation();

  return (
    <ThemedView child style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerTextWrapper}>
          <IconLabel
            backgroundColor={Palette.yellow}
            icon={<AppIcon icon={Icons.coins} size={16} color={Palette.black} />}
          />
          <ThemedText child style={styles.headerText}>
            {t("kid.home.coinStash")}
          </ThemedText>
        </View>
        <Badge icon={Icons.coins} text={String(coinBalance)} color={Palette.yellow} />
      </View>

      <View style={styles.content}>
        <StashCard
          icon={Icons.coins}
          color={Palette.yellow}
          title={t("common.coins")}
          value={coinBalance}
        />
        <StashCard
          icon={Icons.lightning}
          color={Palette.blue}
          title={t("common.xp")}
          value={xpTotal}
        />
      </View>
    </ThemedView>
  );
}

type StashCardTypes = {
  icon: IconType;
  color: string;
  title: string;
  value: number;
};
function StashCard({ icon, color, title, value }: StashCardTypes) {
  return (
    <View style={styles.stashWrapper}>
      <View style={styles.stash}>
        <AppIcon icon={icon} size={17} color={color} />
        <ThemedText mono style={styles.stashTitle}>
          {title}
        </ThemedText>
      </View>
      <ThemedText mono style={[styles.stashValue, { color }]}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    textTransform: "uppercase",
    color: Palette.white,
  },
  content: {
    flexDirection: "row",
    gap: 12,
  },

  //CoinStash
  stashWrapper: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    flex: 1,
    borderColor: Palette.borderBlue,
  },
  stash: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  stashTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    color: Palette.darkGrey,
  },
  stashValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});
