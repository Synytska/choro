import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { paddingHorizontal, taskStatus } from "@/lib/constants";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";

export function HomeScreenHeader() {
  const colors = useAppColors();
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { data: dashboardData, isLoading } = useKidDashboard();
  const child = dashboardData?.child;
  const pendingTasks = dashboardData?.tasks.filter((task) => task.status === taskStatus.pending);

  const questText =
    pendingTasks && pendingTasks.length > 1 ? t("common.quests") : t("common.quest");

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
      paddingTop: topInset + 10,
    },
    avatar: {
      shadowColor: colors.green,
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

  if (isLoading)
    return (
      <ThemedView style={[dynamicStyles.header, styles.header]}>
        <ChildHeaderSkeleton />
      </ThemedView>
    );

  return (
    <ThemedView style={[dynamicStyles.header, styles.header]}>
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
            <ThemedText child style={[dynamicStyles.playerName, styles.playerName]}>
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
        {t("kid.home.brief", { length: `${pendingTasks?.length ?? 0} ${questText}` })}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 2,
    gap: 12,
    paddingHorizontal: paddingHorizontal,
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
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 0.4,
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
