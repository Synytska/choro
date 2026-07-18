import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { paddingHorizontal } from "@/lib/constants";
import { ChildCard } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

export function KidHeader({ child }: { child?: ChildCard }) {
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
    },

    avatar: {
      backgroundColor: colors.yellow,
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
    <View style={[dynamicStyles.header, styles.header]}>
      <View style={styles.headerTop}>
        <View style={styles.greeting}>
          <View style={[dynamicStyles.avatar, styles.avatar, globalStyles.kidShadow]}>
            <Image
              source={getChildAvatarImage(child?.avatarId, child?.avatarUrl)}
              contentFit="cover"
              style={styles.image}
            />
          </View>
          <View style={styles.playerMeta}>
            <ThemedText mono style={[dynamicStyles.playerName, styles.playerName]}>
              PLAYER: {child?.name ?? "Kid"}
            </ThemedText>
            <View style={[dynamicStyles.levelBadge, styles.levelBadge, globalStyles.kidShadow]}>
              <Text style={dynamicStyles.badgeIcon}>✨</Text>
              <ThemedText mono style={[dynamicStyles.levelText, styles.levelText]}>
                LEVEL 12
              </ThemedText>
            </View>
          </View>
        </View>
        <IconButton
          icon={Icons.notification}
          onPress={() => {}}
          round
          borderColor={colors.yellow}
        />
      </View>
      <ThemedText mono style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
        MISSION BRIEFING: Complete 5 quests to level up.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    marginHorizontal: -paddingHorizontal,
    gap: 12,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  playerMeta: {
    gap: 4,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "900",
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
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: 800,
  },
});
