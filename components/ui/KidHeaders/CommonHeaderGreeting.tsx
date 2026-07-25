import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { Badge } from "../Badge";
import { styles } from "./styles";

export function CommonHeaderGreeting() {
  const colors = useAppColors();
  const { t } = useTranslation();

  const { child } = useKidDashboardTasks();

  const dynamicStyles = StyleSheet.create({
    avatar: {
      shadowColor: colors.green,
    },
    playerName: {
      color: colors.white,
    },
  });

  return (
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
        <Badge
          color={colors.green}
          emoji="✨"
          text={t("kid.home.level", { level: child?.level })}
        />
      </View>
    </View>
  );
}
