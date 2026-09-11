import "react-native-reanimated";

import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono";
import { Handjet_700Bold } from "@expo-google-fonts/handjet/700Bold";
import { Jersey20_400Regular } from "@expo-google-fonts/jersey-20/400Regular";
import { Rubik_800ExtraBold } from "@expo-google-fonts/rubik/800ExtraBold";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";

import { AchievementUnlockWatcher } from "@/components/ui/celebration/AchievementUnlockWatcher";
import { CoinGainOverlay } from "@/components/ui/celebration/CoinGainOverlay";
import { CoinGainWatcher } from "@/components/ui/celebration/CoinGainWatcher";
import { LevelUpOverlay } from "@/components/ui/celebration/LevelUpOverlay";
import { LevelUpWatcher } from "@/components/ui/celebration/LevelUpWatcher";
import { PetGrownOverlay } from "@/components/ui/celebration/PetGrownOverlay";
import { toastConfig } from "@/components/ui/toast/toastConfig";
import { authService } from "@/features/auth/api/auth-api";
import {
  useNotificationObserver,
  usePushNotificationRegistration,
} from "@/features/notifications/hooks/usePushNotifications";
import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n from "@/i18n";
import { normalizeLanguage } from "@/lib/utils/utils";
import { queryClient, queryClientPersistOptions } from "@/queryClient";
import { store } from "@/store";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export const unstable_settings = {
  anchor: "(auth)",
};

WebBrowser.maybeCompleteAuthSession();

function AuthSessionSync() {
  const dispatch = useAppDispatch();
  const { data } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: authService.getCurrentSession,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const language = normalizeLanguage(data.profile.language);

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    if (data.kind !== "kid") {
      return;
    }

    dispatch(
      setCredentials({
        user: data.profile,
      }),
    );
  }, [data, dispatch]);

  return null;
}

function PushNotificationSync() {
  useNotificationObserver();
  usePushNotificationRegistration();

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Handjet_700Bold,
    Jersey20_400Regular,
    Rubik_800ExtraBold,
    GeistMono_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={queryClientPersistOptions}>
      <ReduxProvider store={store}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
            <AuthSessionSync />
            <PushNotificationSync />
            <KeyboardProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="(auth)"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
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
                  name="forgot-password-modal"
                  options={{ presentation: "modal", headerShown: false }}
                />
                <Stack.Screen
                  name="reset-password-modal"
                  options={{ presentation: "modal", headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="reset-password"
                  options={{ headerShown: false, gestureEnabled: false }}
                />
                <Stack.Screen
                  name="language-modal"
                  options={{ presentation: "modal", headerShown: false }}
                />
                <Stack.Screen
                  name="approve-task-modal"
                  options={{ presentation: "modal", headerShown: false }}
                />
                <Stack.Screen
                  name="give-gift-modal"
                  options={{ presentation: "modal", headerShown: false }}
                />
                <Stack.Screen
                  name="unlock-achievement-modal"
                  options={{ presentation: "modal", headerShown: false }}
                />
              </Stack>
            </KeyboardProvider>
            <CoinGainWatcher />
            <AchievementUnlockWatcher />
            <LevelUpWatcher />
            <CoinGainOverlay />
            <PetGrownOverlay />
            <LevelUpOverlay />
            <Toast config={toastConfig} topOffset={70} />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </ThemeProvider>
      </ReduxProvider>
    </PersistQueryClientProvider>
  );
}
