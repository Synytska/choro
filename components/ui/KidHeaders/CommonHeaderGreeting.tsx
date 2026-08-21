import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Palette } from "@/constants/theme";
import { useKidDashboardTasks } from "@/features/kid-dashboard/home/hooks/useKidDashboardTasks";
import { globalStyles } from "@/features/styles";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { Badge } from "../Badge";
import { styles } from "./styles";

export function CommonHeaderGreeting() {
  const { t } = useTranslation();

  const { child } = useKidDashboardTasks();

  return (
    <View style={styles.greeting}>
      <View style={[styles.avatar, globalStyles.kidShadow]}>
        <Image
          source={getChildAvatarImage(child?.avatarId, child?.avatarUrl, true)}
          contentFit="cover"
          style={styles.image}
        />
      </View>
      <View style={styles.playerMeta}>
        <ThemedText child style={styles.playerName}>
          {t("kid.home.player", { name: child?.name })}
        </ThemedText>
        <Badge
          color={Palette.green}
          emoji="✨"
          text={t("kid.home.level", { level: child?.level })}
        />
      </View>
    </View>
  );
}
