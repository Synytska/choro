import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { HomeScreenHeader } from "@/components/ui/KidHeaders/HomeScreenHeader";

export default function KidRewardsLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HomeScreenHeader brief={t("kid.rewards.brief")} />,
        }}
      />
    </Stack>
  );
}
