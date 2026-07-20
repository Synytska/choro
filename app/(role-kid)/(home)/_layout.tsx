import { Stack } from "expo-router";

import { HomeScreenHeader } from "@/components/ui/KidHeaders/HomeScreenHeader";

export default function ChildrenHomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <HomeScreenHeader />,
        }}
      />
      <Stack.Screen name="confirm-task" options={{ headerShown: false }} />
    </Stack>
  );
}
