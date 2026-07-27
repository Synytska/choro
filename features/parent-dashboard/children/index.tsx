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
import { useSwipeToDeleteList } from "@/hooks/useSwipeToDeleteList";
import { role, scrollViewTop, taskStatus } from "@/lib/constants";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { CustomSubtitle } from "./components/CustomSubtitle";
import { useChildren } from "./hooks/useChildren";
import { useDeleteChild } from "./hooks/useDeleteChild";

export default function ParentChildrenUI() {
  const { t } = useTranslation();

  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();
  const deleteChild = useDeleteChild();
  const {
    closeAllSwipeables,
    handleSwipeEnd,
    handleSwipeOpen,
    handleSwipeStart,
    isScrollEnabled,
    setSwipeableRef,
  } = useSwipeToDeleteList();

  const children = dashboardData?.children ?? [];
  const tasksToApproveByChildId = useMemo(
    () =>
      (dashboardData?.tasks ?? []).reduce<Record<string, number>>((acc, task) => {
        if (!task.childId || task.status !== taskStatus.review) return acc;

        acc[task.childId] = (acc[task.childId] ?? 0) + 1;

        return acc;
      }, {}),
    [dashboardData?.tasks],
  );

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
      <Header
        title={t("common.children")}
        icon={<IconButton round onPress={onAddChildPress} iconSize={24} />}
      />

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
                badgeValue={tasksToApproveByChildId[item.id]}
              />
            </SwipeToDelete>
          )}
          scrollEnabled={isScrollEnabled}
          onScrollBeginDrag={closeAllSwipeables}
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
