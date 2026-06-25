import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="gender" />
      <Stack.Screen name="name" />
      <Stack.Screen name="age" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="prize" />
      <Stack.Screen name="finish" />
    </Stack>
  );
}
