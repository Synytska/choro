import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomFlatList } from "@/components/FlatList";
import { Icons } from "@/components/ui/AppIcon";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import SwipeToDelete, { SwipeToDeleteRef } from "@/components/ui/SwipeToDelete";
import { scrollViewTop, tabBarHeight } from "@/lib/constants";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { CustomSubtitle } from "./components/CustomSubtitle";
import { useChildren } from "./hooks/useChildren";
import { useDeleteChild } from "./hooks/useDeleteChild";

export default function ParentChildrenUI() {
  const { t } = useTranslation();
  const insetsBottom = useSafeAreaInsets().bottom;

  const { data: dashboardData } = useChildren();
  const deleteChild = useDeleteChild();
  const childRefs = useRef<Record<string, SwipeToDeleteRef | null>>({});
  const [isChildrenListScrollEnabled, setIsChildrenListScrollEnabled] = useState(true);

  const children = dashboardData?.children ?? [];

  const closeAllSwipeables = useCallback(() => {
    Object.values(childRefs.current).forEach((ref) => {
      ref?.close();
    });
  }, []);

  const handleSwipeOpen = useCallback((openedChildId: string) => {
    Object.entries(childRefs.current).forEach(([childId, ref]) => {
      if (childId !== openedChildId) {
        ref?.close();
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      closeAllSwipeables();
    }, [closeAllSwipeables]),
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

    const child = children.filter((ch) => ch.id === childId);

    Alert.alert(
      t("parent.children.deleteAccountConfirmTitle", { name: child[0].name }),
      t("parent.children.deleteAccountConfirmMessage", { name: child[0].name }),
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
    <PageView background="parent">
      <Header
        title={t("common.children")}
        icon={<IconButton round onPress={onAddChildPress} iconSize={24} />}
      />

      <CustomFlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeToDelete
            ref={(ref) => {
              childRefs.current[item.id] = ref;
            }}
            item={item}
            handleSwipeOpen={handleSwipeOpen}
            handleDelete={onDeleteChildPress}
            onSwipeStart={() => setIsChildrenListScrollEnabled(false)}
            onSwipeEnd={() => setIsChildrenListScrollEnabled(true)}
          >
            <ReusableCard
              title={item.name}
              image={getChildAvatarImage(item.avatarId, item.avatarUrl)}
              onPress={() => onChildPress(item.id)}
              customSubtitle={<CustomSubtitle age={item.age} coins={item.coins} />}
              aditionalContent={
                <IconButton icon={Icons.chevronRight} onPress={() => onChildPress(item.id)} />
              }
            />
          </SwipeToDelete>
        )}
        scrollEnabled={isChildrenListScrollEnabled}
        onScrollBeginDrag={closeAllSwipeables}
        withBottomPadding
        contentContainerStyle={styles.cardsWrapper}
      />
    </PageView>
  );
}

const styles = StyleSheet.create({
  cardsWrapper: {
    gap: 12,
    paddingTop: scrollViewTop,
  },
});
