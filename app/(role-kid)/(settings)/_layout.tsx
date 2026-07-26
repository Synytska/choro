import { Stack } from "expo-router";

import { SetttingsScreenHeader } from "@/components/ui/KidHeaders/SetttingsScreenHeader";

export default function KidSettingsLayout() {
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
