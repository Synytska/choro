import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/theme";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";

import { Badge } from "../Badge";
import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { CommonHeaderGreeting } from "./CommonHeaderGreeting";
import { styles } from "./styles";

export function HomeScreenHeader({ brief }: { brief?: string }) {
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { isLoading, child, data } = useKidDashboardTasks();

  const xpToNextLevel = Math.max(0, (child?.xpNextLevel ?? 0) - (child?.xpCurrentLevel ?? 0));

  const headerBrief = brief
    ? brief
    : `${t("common.brief")}${t("kid.home.brief", {
        length: `${xpToNextLevel}`,
      })}`;

  const dynamicStyles = StyleSheet.create({
    header: {
      paddingTop: topInset + 10,
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
        <CommonHeaderGreeting />
        <Badge
          emoji="🔥"
          text={t("kid.tasks.totalDays", {
            total: data?.achievementStats?.currentTaskStreakDays,
          })}
          color={Palette.orange}
        />
      </View>
      <ThemedText mono style={styles.headerSubtitle}>
        {headerBrief}
      </ThemedText>
    </ThemedView>
  );
}
