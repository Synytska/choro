import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import ChildWrapper from "@/components/ui/ChildWrapper";
import { LogoLoader } from "@/components/ui/LogoLoader";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Palette } from "@/constants/theme";
import { scrollViewTopKid } from "@/lib/constants";

import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";
import { PetHatchCard } from "./components/PetHatchCard";

export default function ChildrenSettingsUI() {
  const { t } = useTranslation();
  const { child, isLoading } = useKidDashboardTasks();

  return (
    <ChildWrapper>
      <CustomScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <ThemedText child style={styles.title}>
          {t("common.settings")}
        </ThemedText>

        {isLoading ? (
          <LogoLoader style={styles.loader} textColor={Palette.white} />
        ) : (
          <PetHatchCard level={child?.level} petName={child?.name} xpTotal={child?.xpTotal} />
        )}
      </CustomScrollView>
    </ChildWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    zIndex: 100,
  },
  container: {
    marginTop: scrollViewTopKid,
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    color: Palette.white,
    fontSize: 42,
    lineHeight: 44,
  },
  loader: {
    alignSelf: "center",
  },
});
