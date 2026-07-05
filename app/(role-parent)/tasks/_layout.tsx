import { Stack } from "expo-router";

export default function ParentTasksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create-task" />
    </Stack>
  );
}
