import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { SetttingsScreenHeader } from "@/components/ui/KidHeaders/SetttingsScreenHeader";

export default function KidSettingsLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <SetttingsScreenHeader />,
        }}
      />
    </Stack>
  );
}
