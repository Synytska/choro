import "react-native-reanimated";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";

import { toastConfig } from "@/components/ui/toast/toastConfig";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n from "@/i18n";
import { normalizeLanguage } from "@/lib/utils/utils";
import { queryClient } from "@/queryClient";
import { store } from "@/store";

export const unstable_settings = {
  anchor: "(auth)",
};

function ProfileLanguageSync() {
  const { data: profile } = useProfile();

  useEffect(() => {
    if (!profile?.language) return;

    const language = normalizeLanguage(profile.language);

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [profile?.language]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
            <ProfileLanguageSync />
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
              <Stack.Screen
                name="create-reward-modal"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="edit-reward-modal"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="change-password-modal"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="language-modal"
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
