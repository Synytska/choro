import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import PageView from "@/components/ui/PageView";
import { useChildren } from "@/features/auth/hooks/useChildren";
import { useAppColors } from "@/hooks/use-app-colors";

import { ChildCard } from "./components/ChildCard";

export default function ParentDashboardChildrenUI() {
  const { t } = useTranslation();
  const colors = useAppColors();

  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();

  const children = dashboardData?.children ?? [];

  const dynamicStyles = StyleSheet.create({
    buttonWrapper: {
      borderColor: colors.middleGrey,
    },
    buttonText: {
      color: colors.darkGrey,
    },
  });

  const onAddChildPress = () => {
    router.push("/add-child-modal");
  };

  return (
    <PageView background="parent">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollWrapper}>
        <View style={styles.logoWrapper}>
          <LogoSmall />
          <ThemedText style={styles.greeting}>{t("common.children")}</ThemedText>
        </View>

        <View style={styles.cardsWrapper}>
          {children.map((ch, index) => (
            <ChildCard key={`${ch.name}${index}`} name={ch.name} age={ch.age} coins={ch.coins} />
          ))}
        </View>

        <TouchableOpacity
          onPress={onAddChildPress}
          style={[styles.buttonWrapper, dynamicStyles.buttonWrapper]}
        >
          <AppIcon icon={Icons.add} color={colors.darkGrey} size={22} />
          <ThemedText style={[styles.buttonText, dynamicStyles.buttonText]}>
            {t("p-dashboard.children.addChild")}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    gap: 24,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  cardsWrapper: {
    gap: 12,
  },
  buttonWrapper: {
    borderWidth: 1,
    alignItems: "center",
    padding: 26,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderStyle: "dashed",
  },
  buttonText: {
    fontWeight: 600,
    fontSize: 15,
  },
});
