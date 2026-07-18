import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

import { Badge } from "./Badge";
import { IconLabel } from "./IconLabel";

export function XpCard() {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    xpCard: {
      shadowColor: colors.green,
    },
    xpTitleText: {
      color: colors.white,
    },
    levelUpPill: {
      backgroundColor: colors.green,
      shadowColor: colors.green,
    },
    levelUpText: {
      color: colors.darkNavy,
    },
    xpTrack: {
      borderColor: colors.borderBlue,
      backgroundColor: colors.darkNavy,
    },
    xpFill: {
      backgroundColor: colors.green,
    },
    xpMetaMuted: {
      color: colors.darkGrey,
    },
    xpMetaStrong: {
      color: colors.green,
    },
  });

  return (
    <ThemedView child style={[styles.xpCard, dynamicStyles.xpCard, globalStyles.shadow]}>
      <View style={styles.xpHeader}>
        <View style={styles.xpTitle}>
          <IconLabel
            style={[globalStyles.kidShadow, { shadowColor: colors.green }]}
            backgroundColor={colors.green}
            icon={<AppIcon icon={Icons.lightning} color={colors.darkNavy} size={18} />}
          />
          <ThemedText mono style={[styles.xpTitleText, dynamicStyles.xpTitleText]}>
            XP PROGRESS
          </ThemedText>
        </View>
        <Badge
          icon={Icons.chevronUp}
          text="LEVEL UP!"
          iconSize={16}
          iconColor={colors.darkNavy}
          style={[dynamicStyles.levelUpPill, styles.levelUpPill, globalStyles.kidShadow]}
        />
      </View>

      <View style={[styles.xpTrack, dynamicStyles.xpTrack]}>
        <View style={[styles.xpFill, dynamicStyles.xpFill]} />
      </View>

      <View style={styles.xpMeta}>
        <ThemedText mono style={[styles.xpMetaMuted, dynamicStyles.xpMetaMuted]}>
          3 / 5 QUESTS
        </ThemedText>
        <ThemedText mono style={[styles.xpMetaStrong, dynamicStyles.xpMetaStrong]}>
          +60 XP
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  xpCard: {
    gap: 12,
    padding: 16,
  },
  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  xpTitleText: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  levelUpPill: {
    paddingVertical: 8,
    borderRadius: 100,
  },
  levelUpText: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 13,
  },
  xpTrack: {
    height: 18,
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 2,
  },
  xpFill: {
    width: "71%",
    height: "100%",
  },
  xpMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpMetaMuted: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "800",
  },
  xpMetaStrong: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 14,
  },
});
