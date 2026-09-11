// app/index.tsx

import { useIsRestoring, useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { LogoLoader } from "@/components/ui/LogoLoader";
import { authService } from "@/features/auth/api/auth-api";
import { useThemeColor } from "@/hooks/use-theme-color";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function Index() {
  const dispatch = useAppDispatch();
  const background = useThemeColor({}, "background");
  const isRestoringCache = useIsRestoring();

  const [isKidSessionRestored, setIsKidSessionRestored] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: authService.getCurrentSession,
  });

  useEffect(() => {
    if (data?.kind !== "kid") {
      setIsKidSessionRestored(false);
      return;
    }

    dispatch(
      setCredentials({
        user: data.profile,
      }),
    );
    setIsKidSessionRestored(true);
  }, [data, dispatch]);

  if (isRestoringCache || isLoading || (data?.kind === "kid" && !isKidSessionRestored)) {
    return (
      <View style={[styles.loader, { backgroundColor: background }]}>
        <LogoLoader />
      </View>
    );
  }

  if (!data) return <Redirect href="/(auth)/login/parent-login" />;

  if (data.kind === "kid") {
    return <Redirect href="/(role-kid)/(home)" />;
  }

  return <Redirect href={data.profile.onboarding_completed ? "/(role-parent)" : "/(onboarding)"} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
