import { StyleSheet } from "react-native";

import ChildWrapper from "@/components/ui/ChildWrapper";
import { LogoLoader } from "@/components/ui/LogoLoader";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { Palette } from "@/constants/theme";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { scrollViewTopKid } from "@/lib/constants";

import { useKidDashboardTasks } from "../home/hooks/useKidDashboardTasks";
import { PetHatchCard } from "./components/PetHatchCard";

export default function ChildrenSettingsUI() {
  const { child, isLoading, refetch } = useKidDashboardTasks();
  const refreshControl = usePullToRefresh({ onRefresh: refetch });

  return (
    <ChildWrapper>
      <CustomScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshing={refreshControl.refreshing}
        onRefresh={refreshControl.onRefresh}
      >
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
    fontSize: 28,
    textTransform: "uppercase",
  },
  loader: {
    alignSelf: "center",
  },
});
