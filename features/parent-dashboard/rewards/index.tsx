import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { ChildCardComponent } from "@/components/ui/ChildCard";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { addButtonSize, rewardEmojiOptions } from "@/lib/constants";

import { useChildren } from "../children/hooks/useChildren";
import { RewardCardComponent } from "./components/RewardCard";

const rewards = [
  { id: "1", icon: rewardEmojiOptions[0], title: "Extra screen time", coins: "50" },
  { id: "12", icon: rewardEmojiOptions[1], title: "Extra screen time", coins: "50" },
  { id: "123", icon: rewardEmojiOptions[2], title: "Extra screen time", coins: "50" },
  { id: "1234", icon: rewardEmojiOptions[3], title: "Extra screen time", coins: "50" },
];
export function ParentDashboardRewardsUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();

  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const children = dashboardData?.children ?? [];

  const [selectedChild, setSelectedChild] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  useEffect(() => {
    if (!selectedChild.id && children[0]?.id) {
      setSelectedChild({ name: children[0].name, id: children[0].id });
    }
  }, [children, selectedChild.id]);

  return (
    <PageView background="parent">
      <View style={styles.logoWrapper}>
        <LogoSmall />
        <View>
          <ThemedText style={styles.header}>{t("common.rewards")}</ThemedText>
          <ThemedText type="subtitle">{t("p-dashboard.rewards.rewardsSubtitle")}</ThemedText>
        </View>
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
          //TODO: Add onpress
          onPress={() => {}}
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
