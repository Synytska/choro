import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ChildCardComponent } from "@/components/ui/ChildCard";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import SwipeToDelete, { SwipeToDeleteRef } from "@/components/ui/SwipeToDelete";
import { useAppColors } from "@/hooks/use-app-colors";
import { tabBarHeight } from "@/lib/constants";
import { RewardCard } from "@/lib/types";

import { useChildren } from "../children/hooks/useChildren";
import { RewardCardComponent } from "./components/RewardCard";
import { useDeleteReward } from "./hooks/useDeleteReward";

export function ParentRewardsUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: dashboardData } = useChildren();
  const children = dashboardData?.children ?? [];
  const deleteReward = useDeleteReward();

  const [selectedChild, setSelectedChild] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const [isRewardsListScrollEnabled, setIsRewardsListScrollEnabled] = useState(true);

  const rewardRefs = useRef<Record<string, SwipeToDeleteRef | null>>({});

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

  const closeAllSwipeables = useCallback(() => {
    Object.values(rewardRefs.current).forEach((ref) => {
      ref?.close();
    });
  }, []);

  const handleSwipeOpen = useCallback((openedRewardId: string) => {
    Object.entries(rewardRefs.current).forEach(([rewardId, ref]) => {
      if (rewardId !== openedRewardId) {
        ref?.close();
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      closeAllSwipeables();
    }, [closeAllSwipeables]),
  );

  const onCreateRewardPress = () => {
    closeAllSwipeables();
    router.push("/create-reward-modal");
  };

  const onEditRewardPress = (rewardId: string) => {
    closeAllSwipeables();
    router.push({
      pathname: "/edit-reward-modal",
      params: { rewardId },
    });
  };

  const onDeleteRewardPress = (rewardId: string) => {
    if (deleteReward.isPending) return;

    deleteReward.mutate({ rewardId });
  };

  return (
    <PageView background="parent">
      <Header
        title={t("common.rewards")}
        icon={<IconButton onPress={onCreateRewardPress} iconSize={24} />}
      />

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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsWrapper}
        />
      </View>

      {/* Render Rewards list */}
      <View style={styles.rewardsWrapper}>
        <ThemedText style={styles.name}>{selectedChild.name}</ThemedText>
        <FlatList
          data={rewards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeToDelete
              ref={(ref) => {
                rewardRefs.current[item.id] = ref;
              }}
              item={item}
              handleSwipeOpen={handleSwipeOpen}
              handleDelete={onDeleteRewardPress}
              onSwipeStart={() => setIsRewardsListScrollEnabled(false)}
              onSwipeEnd={() => setIsRewardsListScrollEnabled(true)}
            >
              <RewardCardComponent item={item} onEditPress={() => onEditRewardPress(item.id)} />
            </SwipeToDelete>
          )}
          contentContainerStyle={[
            styles.faltListRewards,
            { paddingBottom: insets.bottom + tabBarHeight },
          ]}
          onScrollBeginDrag={closeAllSwipeables}
          scrollEnabled={isRewardsListScrollEnabled}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
  },
});
