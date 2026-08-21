import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/theme";
import { useKidDashboard } from "@/features/kid-dashboard/home/hooks/useKidDashboard";
import { getDate } from "@/lib/utils/utils";

import { Badge } from "../Badge";
import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { styles } from "./styles";

export function TasksScreenHeader() {
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { data: dashboardData, isLoading } = useKidDashboard();
  const today = new Date();

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
        <View style={styles.greeting}>
          <View style={styles.playerMeta}>
            <ThemedText child style={styles.playerName}>
              {t("kid.tasks.dailyTasks")}
            </ThemedText>
          </View>
        </View>
        <Badge
          emoji="🔥"
          text={t("kid.tasks.totalDays", {
            total: dashboardData?.achievementStats?.currentTaskStreakDays,
          })}
          color={Palette.orange}
        />
      </View>
      <ThemedText mono style={styles.headerSubtitle}>
        {t("kid.tasks.date", { date: getDate(today) })}
      </ThemedText>
    </ThemedView>
  );
}
