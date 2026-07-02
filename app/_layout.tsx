import "@/i18n";
import "react-native-reanimated";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";

import { toastConfig } from "@/components/ui/toast/toastConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/queryClient";
import { store } from "@/store";

export const unstable_settings = {
  anchor: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(role-parent)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="(role-kid)" options={{ gestureEnabled: false }} />
              <Stack.Screen
                name="add-child-modal"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="edit-child-modal"
                options={{ presentation: "modal", headerShown: false }}
              />
            </Stack>
            <Toast config={toastConfig} topOffset={70} />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </ThemeProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
