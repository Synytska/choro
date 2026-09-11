import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { TasksScreenHeader } from "@/components/ui/KidHeaders/TasksScreenHeader";
import { Fonts, Palette } from "@/constants/theme";

export default function ChildrenTasksLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <TasksScreenHeader />,
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
            fontWeight: "bold",
            fontFamily: Fonts.kid,
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
