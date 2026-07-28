import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { useAppColors } from "@/hooks/use-app-colors";
import { getDate } from "@/lib/utils/utils";

import { Badge } from "../Badge";
import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { styles } from "./styles";

export function TasksScreenHeader() {
  const colors = useAppColors();
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { data: dashboardData, isLoading } = useKidDashboard();
  const today = new Date();

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
      paddingTop: topInset + 10,
    },
    playerName: {
      color: colors.white,
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
          <View style={styles.playerMeta}>
            <ThemedText child style={[dynamicStyles.playerName, styles.playerName]}>
              {t("kid.tasks.dailyTasks")}
            </ThemedText>
          </View>
        </View>
        <Badge
          emoji="🔥"
          text={t("kid.tasks.totalDays", {
            total: dashboardData?.achievementStats?.currentTaskStreakDays,
          })}
          color={colors.orange}
        />
      </View>
      <ThemedText mono style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
        {t("kid.tasks.date", { date: getDate(today) })}
      </ThemedText>
    </ThemedView>
  );
}
