import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";
import { useAppColors } from "@/hooks/use-app-colors";

import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { CommonHeaderGreeting } from "./CommonHeaderGreeting";
import { styles } from "./styles";

export function SetttingsScreenHeader() {
  const colors = useAppColors();
  const topInset = useSafeAreaInsets().top;
  const { t } = useTranslation();

  const { isLoading } = useKidDashboardTasks();

  const dynamicStyles = StyleSheet.create({
    header: {
      backgroundColor: colors.darkNavy,
      borderColor: colors.borderBlue,
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

        <IconButton
          icon={Icons.logout}
          onPress={() => {}}
          round
          borderColor={colors.error}
          size={44}
        />
      </View>
    </ThemedView>
  );
}
