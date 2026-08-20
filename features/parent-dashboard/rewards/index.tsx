import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { ThemedText } from "@/components/themed-text";
import { ChildTabsComponent } from "@/components/ui/ChildTabs";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ChildTabsSkeleton } from "@/components/ui/skeletons/ChildTabsSkeleton";
import { ReusableCardSkeleton } from "@/components/ui/skeletons/ReusableCardSkeleton";
import SwipeToDelete from "@/components/ui/SwipeToDelete";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSwipeToDeleteList } from "@/hooks/useSwipeToDeleteList";
import { role, scrollViewTop } from "@/lib/constants";
import { RewardCard } from "@/lib/types";

import { useChildren } from "../children/hooks/useChildren";
import { RewardCardComponent } from "./components/RewardCard";
import { useDeleteReward } from "./hooks/useDeleteReward";
import { getVisibleParentRewards } from "./utils/rewardFilters";

export function ParentRewardsUI() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: dashboardData, isLoading: isChildrenLoading, refetch } = useChildren();
  const children = useMemo(() => dashboardData?.children ?? [], [dashboardData?.children]);
  const deleteReward = useDeleteReward();

  const [selectedChild, setSelectedChild] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const {
    closeAllSwipeables,
    handleSwipeEnd,
    handleSwipeOpen,
    handleSwipeStart,
    isScrollEnabled,
    setSwipeableRef,
  } = useSwipeToDeleteList();
  const refreshControl = usePullToRefresh({
    onRefresh: refetch,
    shouldRefresh: () => {
      closeAllSwipeables();
      return true;
    },
  });

  const rewards = useMemo<RewardCard[]>(
    () =>
      getVisibleParentRewards(dashboardData?.rewards ?? [], selectedChild.id).map((reward) => ({
        id: reward.id,
        icon: reward.icon,
        imageUri: reward.imageUri,
        title: reward.name,
        coins: String(reward.coinAmount),
        status: reward.status,
      })),
    [dashboardData?.rewards, selectedChild.id],
  );

  useEffect(() => {
    if (!selectedChild.id && children[0]?.id) {
      setSelectedChild({ name: children[0].name, id: children[0].id });
    }
  }, [children, selectedChild.id]);

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

    Alert.alert(t("parent.rewards.deleteRewardConfirmTitle", { name: selectedChild.name }), "", [
      {
        text: t("common.cancel"),
        style: "cancel",
        onPress: closeAllSwipeables,
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => deleteReward.mutate({ rewardId }),
      },
    ]);
  };

  return (
    <PageView screen={role.parent}>
      <Header
        title={t("common.rewards")}
        icon={<IconButton round onPress={onCreateRewardPress} iconSize={24} />}
      />

      {/* Render Children list */}
      {isChildrenLoading && !dashboardData ? (
        <View style={styles.tabsWrapper}>
          <ChildTabsSkeleton />
        </View>
      ) : (
        <View>
          <CustomFlatList
            data={children}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChildTabsComponent
                item={item}
                onPress={() => setSelectedChild({ name: item.name, id: item.id })}
                isSelected={item.id === selectedChild.id}
              />
            )}
            horizontal
            contentContainerStyle={styles.tabsWrapper}
          />
        </View>
      )}

      {/* Render Rewards list */}
      <View style={styles.rewardsWrapper}>
        {isChildrenLoading && !dashboardData ? (
          <ReusableCardSkeleton amount={5} />
        ) : (
          <>
            <ThemedText style={styles.name}>{selectedChild.name}</ThemedText>
            <CustomFlatList
              data={rewards}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SwipeToDelete
                  ref={setSwipeableRef(item.id)}
                  item={item}
                  handleSwipeOpen={handleSwipeOpen}
                  handleDelete={onDeleteRewardPress}
                  onSwipeStart={handleSwipeStart}
                  onSwipeEnd={handleSwipeEnd}
                >
                  <RewardCardComponent item={item} onEditPress={() => onEditRewardPress(item.id)} />
                </SwipeToDelete>
              )}
              contentContainerStyle={styles.faltListRewards}
              withBottomPadding
              onScrollBeginDrag={closeAllSwipeables}
              refreshing={refreshControl.refreshing}
              onRefresh={refreshControl.onRefresh}
              scrollEnabled={isScrollEnabled}
            />
          </>
        )}
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    gap: 10,
    paddingTop: scrollViewTop,
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
