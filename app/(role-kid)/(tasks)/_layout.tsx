import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { TasksScreenHeader } from "@/components/ui/KidHeaders/TasksScreenHeader";
import { useAppColors } from "@/hooks/use-app-colors";
import { useLocalizedFonts } from "@/hooks/useLocalizedFonts";

export default function ChildrenTasksLayout() {
  const colors = useAppColors();
  const fonts = useLocalizedFonts();
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
            backgroundColor: colors.darkNavy,
          },
          headerBackTitle: t("common.back"),
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.green,
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: fonts.kid,
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
