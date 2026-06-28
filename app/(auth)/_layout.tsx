import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(login-tabs)" />
      <Stack.Screen name="parent-signup" />
    </Stack>
  );
}
