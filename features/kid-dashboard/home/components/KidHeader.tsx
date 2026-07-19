import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { paddingHorizontal } from "@/lib/constants";
import { ChildCard } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

export function KidHeader({
  child,
  setHeaderHeight,
  questLength,
}: {
  child?: ChildCard;
  setHeaderHeight: (value: number) => void;
  questLength?: number;
}) {
  const colors = useAppColors();
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
      paddingTop: topInset + 10,
    },

    avatar: {
      shadowColor: colors.yellow,
    },
    avatarIcon: {
      color: colors.blue,
      fontSize: 23,
      fontWeight: "900",
    },
    playerName: {
      color: colors.white,
    },
    levelBadge: {
      borderColor: colors.green,
      shadowColor: colors.green,
    },
    badgeIcon: {
      color: colors.green,
    },
    levelText: {
      color: colors.green,
    },
    headerSubtitle: {
      color: colors.darkGrey,
    },
  });

  return (
    <ThemedView
      style={[dynamicStyles.header, styles.header]}
      onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height - topInset)}
    >
      <View style={styles.headerTop}>
        <View style={styles.greeting}>
          <View style={[dynamicStyles.avatar, styles.avatar, globalStyles.kidShadow]}>
            <Image
              source={getChildAvatarImage(child?.avatarId, child?.avatarUrl, true)}
              contentFit="cover"
              style={styles.image}
            />
          </View>
          <View style={styles.playerMeta}>
            <ThemedText mono style={[dynamicStyles.playerName, styles.playerName]}>
              {t("kid.home.player", { name: child?.name })}
            </ThemedText>
            <View style={[dynamicStyles.levelBadge, styles.levelBadge, globalStyles.kidShadow]}>
              <Text style={dynamicStyles.badgeIcon}>✨</Text>
              <ThemedText mono style={[dynamicStyles.levelText, styles.levelText]}>
                {t("kid.home.level", { level: child?.level })}
              </ThemedText>
            </View>
          </View>
        </View>
        <IconButton
          icon={Icons.notification}
          onPress={() => {}}
          round
          borderColor={colors.yellow}
          size={44}
        />
      </View>
      <ThemedText mono style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
        {t("kid.home.brief", { length: questLength })}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 2,
    gap: 12,
    zIndex: 110,
    paddingHorizontal: paddingHorizontal,
    paddingBottom: 16,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  avatar: {
    width: 44,
    height: 44,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playerMeta: {
    gap: 6,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 19,
  },
  levelBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: 800,
  },
});
