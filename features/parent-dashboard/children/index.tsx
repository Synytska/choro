import { router } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { Icons } from "@/components/ui/AppIcon";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { ReusableCardSkeleton } from "@/components/ui/skeletons/ReusableCardSkeleton";
import SwipeToDelete from "@/components/ui/SwipeToDelete";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useSwipeToDeleteList } from "@/hooks/useSwipeToDeleteList";
import { rewardStatus, role, scrollViewTop, taskStatus } from "@/lib/constants";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { CustomSubtitle } from "./components/CustomSubtitle";
import { useChildren } from "./hooks/useChildren";
import { useDeleteChild } from "./hooks/useDeleteChild";

export default function ParentChildrenUI() {
  const { t } = useTranslation();

  const { data: dashboardData, isLoading: isChildrenLoading, refetch } = useChildren();
  const deleteChild = useDeleteChild();
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

  const children = dashboardData?.children ?? [];
  const badgesByChildId = useMemo(() => {
    const taskBadges = (dashboardData?.tasks ?? []).reduce<Record<string, number>>((acc, task) => {
      if (!task.childId || task.status !== taskStatus.review) return acc;

      acc[task.childId] = (acc[task.childId] ?? 0) + 1;

      return acc;
    }, {});

    return (dashboardData?.rewards ?? []).reduce<Record<string, number>>((acc, reward) => {
      if (reward.status !== rewardStatus.requested) return acc;

      acc[reward.childId] = (acc[reward.childId] ?? 0) + 1;

      return acc;
    }, taskBadges);
  }, [dashboardData?.rewards, dashboardData?.tasks]);

  const onAddChildPress = () => {
    closeAllSwipeables();
    router.push("/add-child-modal");
  };

  const onChildPress = (id: string) => {
    closeAllSwipeables();
    router.push({
      pathname: "/(role-parent)/children/[id]",
      params: { id },
    });
  };

  const onDeleteChildPress = (childId: string) => {
    if (deleteChild.isPending) return;

    const child = children.find((ch) => ch.id === childId);

    if (!child) return;

    Alert.alert(
      t("parent.children.deleteAccountConfirmTitle", { name: child.name }),
      t("parent.children.deleteAccountConfirmMessage", { name: child.name }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: closeAllSwipeables,
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteChild.mutate({ childId }),
        },
      ],
    );
  };

  return (
    <PageView screen={role.parent}>
      <Header title={t("common.children")} icon={<IconButton round onPress={onAddChildPress} />} />

      {isChildrenLoading && !dashboardData ? (
        <ReusableCardSkeleton amount={5} />
      ) : (
        <CustomFlatList
          data={children}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeToDelete
              ref={setSwipeableRef(item.id)}
              item={item}
              handleSwipeOpen={handleSwipeOpen}
              handleDelete={onDeleteChildPress}
              onSwipeStart={handleSwipeStart}
              onSwipeEnd={handleSwipeEnd}
            >
              <ReusableCard
                title={item.name}
                image={getChildAvatarImage(item.avatarId, item.avatarUrl)}
                onPress={() => onChildPress(item.id)}
                customSubtitle={<CustomSubtitle age={item.age} coins={item.coins} />}
                aditionalContent={
                  <IconButton icon={Icons.chevronRight} onPress={() => onChildPress(item.id)} />
                }
                badgeValue={badgesByChildId[item.id]}
              />
            </SwipeToDelete>
          )}
          scrollEnabled={isScrollEnabled}
          onScrollBeginDrag={closeAllSwipeables}
          refreshing={refreshControl.refreshing}
          onRefresh={refreshControl.onRefresh}
          withBottomPadding
          contentContainerStyle={styles.cardsWrapper}
        />
      )}
    </PageView>
  );
}

const styles = StyleSheet.create({
  cardsWrapper: {
    gap: 12,
    paddingTop: scrollViewTop,
  },
});
