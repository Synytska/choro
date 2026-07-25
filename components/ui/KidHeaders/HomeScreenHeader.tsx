import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";
import { useAppColors } from "@/hooks/use-app-colors";

import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { CommonHeaderGreeting } from "./CommonHeaderGreeting";
import { styles } from "./styles";

export function HomeScreenHeader({ brief }: { brief?: string }) {
  const colors = useAppColors();
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { isLoading, pendingTasks } = useKidDashboardTasks();

  const questText =
    pendingTasks && pendingTasks.length > 1 ? t("common.quests") : t("common.quest");
  const headerBrief =
    brief ??
    t("kid.home.brief", {
      length: `${pendingTasks.length} ${questText}`,
    });

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
      paddingTop: topInset + 10,
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
        <CommonHeaderGreeting />
        <IconButton
          icon={Icons.notification}
          onPress={() => {}}
          round
          borderColor={colors.yellow}
          size={44}
        />
      </View>
      <ThemedText mono style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
        {t("common.brief")}
        {headerBrief}
      </ThemedText>
    </ThemedView>
  );
}
