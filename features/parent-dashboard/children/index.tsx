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
      backgroundColor: colors.white,
    },
    buttonText: {
      color: colors.darkGrey,
    },
  });

  const onAddChildPress = () => {
    router.push("/add-child-modal");
  };

  return (
    <PageView background="parent" containerStyle={styles.pageViewContainer}>
      <View style={styles.logoWrapper}>
        <LogoSmall />
        <ThemedText style={styles.greeting}>{t("common.children")}</ThemedText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <View style={styles.cardsWrapper}>
          {children.map((ch, index) => (
            <ChildCard key={`${ch.name}${index}`} name={ch.name} age={ch.age} coins={ch.coins} />
          ))}
        </View>
      </ScrollView>
      <View style={[styles.buttonAbsolute]}>
        <TouchableOpacity
          onPress={onAddChildPress}
          style={[styles.buttonWrapper, dynamicStyles.buttonWrapper]}
        >
          <AppIcon icon={Icons.add} color={colors.darkGrey} size={22} />
          <ThemedText style={[styles.buttonText, dynamicStyles.buttonText]}>
            {t("p-dashboard.children.addChild")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  pageViewContainer: {
    paddingBottom: 0,
  },
  scrollView: {
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
    paddingTop: 24,
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
  buttonAbsolute: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    fontWeight: 600,
    fontSize: 15,
  },
});
