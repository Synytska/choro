// app/index.tsx

import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

import { LogoLoader } from "@/components/ui/LogoLoader";
import { authService } from "@/features/auth/api/auth-api";
import { useAppColors } from "@/hooks/use-app-colors";

export default function Index() {
  const colors = useAppColors();
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: authService.getCurrentSession,
  });

  if (isLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <LogoLoader />
      </View>
    );
  }

  if (!data) return <Redirect href="/(auth)/(login-tabs)/parent-login" />;

  return <Redirect href={data.profile.onboarding_completed ? "/(role-parent)" : "/(onboarding)"} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
