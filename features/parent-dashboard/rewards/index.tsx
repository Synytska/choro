import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { ChildCardComponent } from "@/components/ui/ChildCard";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { addButtonSize } from "@/lib/constants";
import { RewardCard } from "@/lib/types";

import { useChildren } from "../children/hooks/useChildren";
import { RewardCardComponent } from "./components/RewardCard";

export function ParentDashboardRewardsUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();

  const { data: dashboardData } = useChildren();
  const children = dashboardData?.children ?? [];

  const [selectedChild, setSelectedChild] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  const rewards = useMemo<RewardCard[]>(
    () =>
      (dashboardData?.rewards ?? [])
        .filter((reward) => reward.childId === selectedChild.id)
        .map((reward) => ({
          id: reward.id,
          icon: reward.icon,
          imageUri: reward.imageUri,
          title: reward.name,
          coins: String(reward.coinAmount),
        })),
    [dashboardData?.rewards, selectedChild.id],
  );

  useEffect(() => {
    if (!selectedChild.id && children[0]?.id) {
      setSelectedChild({ name: children[0].name, id: children[0].id });
    }
  }, [children, selectedChild.id]);

  const onCreateRewardPress = () => {
    router.push("/create-reward-modal");
  };

  return (
    <PageView background="parent">
      <View style={styles.logoWrapper}>
        <LogoSmall />
        <ThemedText style={styles.header}>{t("common.rewards")}</ThemedText>
      </View>

      {/* Render Children list */}
      <View>
        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChildCardComponent
              item={item}
              onPress={() => setSelectedChild({ name: item.name, id: item.id })}
              isSelected={item.id === selectedChild.id}
            />
          )}
          horizontal
          contentContainerStyle={styles.tabsWrapper}
        />
      </View>

      {/* Render Rewards list */}
      <View style={styles.rewardsWrapper}>
        <ThemedText style={styles.name}>{selectedChild.name}</ThemedText>
        <FlatList
          data={rewards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RewardCardComponent item={item} />}
          contentContainerStyle={styles.faltListRewards}
        />
      </View>

      <View style={[styles.addButton, globalStyles.shadow]}>
        <IconButton
          onPress={onCreateRewardPress}
          backgroundColor={colors.orange}
          borderColor={colors.white}
          size={addButtonSize}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 2,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  header: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  tabsWrapper: {
    gap: 10,
    paddingTop: 32,
  },
  rewardsWrapper: {
    flex: 1,
    paddingTop: 24,
    gap: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  faltListRewards: {
    gap: 10,
  },
});
