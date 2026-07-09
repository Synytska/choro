import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { Header } from "@/components/ui/Header";
import { IconButton } from "@/components/ui/IconButton";
import PageView from "@/components/ui/PageView";

import { ChildCard } from "./components/ChildCard";
import { useChildren } from "./hooks/useChildren";

export default function ParentChildrenUI() {
  const { t } = useTranslation();

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
        icon={<IconButton onPress={onAddChildPress} iconSize={24} />}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <View style={styles.cardsWrapper}>
          {children.map((ch) => (
            <ChildCard
              key={ch.id}
              name={ch.name}
              age={ch.age}
              coins={ch.coins}
              onPress={() => onChildPress(ch.id)}
            />
          ))}
        </View>
      </ScrollView>
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
