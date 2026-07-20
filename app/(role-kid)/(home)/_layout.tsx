import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HomeScreenHeader } from "@/components/ui/KidHeaders/HomeScreenHeader";
import { Fonts } from "@/constants/theme";
import { useAppColors } from "@/hooks/use-app-colors";

export default function ChildrenHomeLayout() {
  const colors = useAppColors();
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HomeScreenHeader />,
        }}
      />
      <Stack.Screen
        name="confirm-task"
        options={{
          title: t("kid.home.questDetails"),
          headerStyle: {
            backgroundColor: colors.darkNavy,
          },
          headerBackTitle: t("common.back"),
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.green,
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: Fonts.kid,
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
