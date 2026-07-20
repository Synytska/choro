import { Stack } from "expo-router";

export default function ChildrenHomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="confirm-task" />
    </Stack>
  );
}
