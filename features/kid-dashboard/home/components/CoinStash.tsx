import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { useAppColors } from "@/hooks/use-app-colors";
import { IconType } from "@/lib/types";

import { Badge } from "./Badge";
import { IconLabel } from "./IconLabel";

type CoinStashProps = {
  coinBalance?: number;
  xpTotal?: number;
};

export function CoinStash({ coinBalance = 0, xpTotal = 0 }: CoinStashProps) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    headerText: {
      color: colors.white,
    },
    badge: {
      borderColor: colors.yellow,
    },
  });

  return (
    <ThemedView child style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerTextWrapper}>
          <IconLabel
            backgroundColor={colors.yellow}
            icon={<AppIcon icon={Icons.coins} size={16} color={colors.black} />}
          />
          <ThemedText child style={[styles.headerText, dynamicStyles.headerText]}>
            {t("kid.home.coinStash")}
          </ThemedText>
        </View>
        <Badge
          icon={Icons.coins}
          text={String(coinBalance)}
          iconColor={colors.yellow}
          style={[styles.badge, dynamicStyles.badge]}
        />
      </View>

      <View style={styles.content}>
        <StashCard
          icon={Icons.coins}
          color={colors.yellow}
          title={t("common.coins")}
          value={coinBalance}
        />
        <StashCard
          icon={Icons.lightning}
          color={colors.blue}
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
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    stashWrapper: {
      borderColor: colors.borderBlue,
    },
    stashTitle: {
      color: colors.darkGrey,
    },
    stashValue: {
      color: color,
    },
  });

  return (
    <View style={[styles.stashWrapper, dynamicStyles.stashWrapper]}>
      <View style={styles.stash}>
        <AppIcon icon={icon} size={17} color={color} />
        <ThemedText mono style={[styles.stashTitle, dynamicStyles.stashTitle]}>
          {title}
        </ThemedText>
      </View>
      <ThemedText mono style={[styles.stashValue, dynamicStyles.stashValue]}>
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
    lineHeight: 22,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  badge: {
    borderWidth: 2,
    borderRadius: 50,
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
  },
  stashValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});
