import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChoroImages } from "@/assets/images";
import { Icons } from "@/components/ui/AppIcon";
import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { tabBarHeight } from "@/lib/constants";

import { CustomSubtitle } from "./components/CustomSubtitle";
import { useChildren } from "./hooks/useChildren";

export default function ParentChildrenUI() {
  const { t } = useTranslation();
  const insetsBottom = useSafeAreaInsets().bottom;

  const { data: dashboardData, isLoading: isChildrenLoading } = useChildren();

  const children = dashboardData?.children ?? [];

  const onAddChildPress = () => {
    router.push("/add-child-modal");
  };

  const onChildPress = (id: string) => {
    router.push({
      pathname: "/(role-parent)/children/[id]",
      params: { id },
    });
  };

  return (
    <PageView background="parent">
      <Header
        title={t("common.children")}
        icon={<IconButton round onPress={onAddChildPress} iconSize={24} />}
      />

      <FlatList
        data={children}
        renderItem={({ item }) => (
          <ReusableCard
            key={item.id}
            title={item.name}
            image={ChoroImages.kidAvatar}
            onPress={() => onChildPress(item.id)}
            customSubtitle={<CustomSubtitle age={item.age} coins={item.coins} />}
            aditionalContent={
              <IconButton icon={Icons.chevronRight} onPress={() => onChildPress(item.id)} />
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.cardsWrapper,
          { paddingBottom: insetsBottom + tabBarHeight },
        ]}
      />
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    gap: 24,
  },
  cardsWrapper: {
    gap: 12,
    paddingTop: 24,
  },
});
