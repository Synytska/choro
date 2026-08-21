import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { Palette } from "@/constants/theme";
import { useKidLogout } from "@/features/auth/hooks/useKidLogout";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";

import { ChildHeaderSkeleton } from "../skeletons/kids/ChildHomeScreenSkeleton";
import { CommonHeaderGreeting } from "./CommonHeaderGreeting";
import { styles } from "./styles";

export function SetttingsScreenHeader() {
  const topInset = useSafeAreaInsets().top;
  const kidLogout = useKidLogout();

  const { isLoading } = useKidDashboardTasks();

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

        <IconButton
          icon={Icons.logout}
          onPress={() => kidLogout.mutate()}
          round
          borderColor={Palette.green}
          size={44}
        />
      </View>
    </ThemedView>
  );
}
