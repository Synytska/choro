import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HomeScreenHeader } from "@/components/ui/KidHeaders/HomeScreenHeader";
import { Fonts, Palette } from "@/constants/theme";

export default function ChildrenHomeLayout() {
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
            backgroundColor: Palette.darkNavy,
          },
          headerBackTitle: t("common.back"),
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: Palette.green,
          headerTitleStyle: {
            fontFamily: Fonts.kid,
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
