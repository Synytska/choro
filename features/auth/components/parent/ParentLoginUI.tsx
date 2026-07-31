import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RedirectAuth } from "@/components/ui/RedirectAuth";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { tabBarHeight } from "@/lib/constants";

import { Header } from "./Header";
import LoginForm from "./LoginForm";

export default function ParentLoginUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dynamicStyles = StyleSheet.create({
    scrollContent: {
      paddingBottom: insets.bottom + tabBarHeight,
    },
  });

  const onSignUpPress = () => {
    router.push("/(auth)/login/parent-signup");
  };

  return (
    <CustomScrollView contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}>
      <View style={styles.container}>
        <Header title={t("auth.parent.title")} subtitle={t("auth.parent.subtitle")} />

        <View style={styles.form}>
          <LoginForm />
          <RedirectAuth
            title={t("auth.parent.redirectSignup")}
            textLink={t("auth.parent.signUp")}
            onPress={onSignUpPress}
          />
        </View>
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
  },
  form: {
    alignSelf: "stretch",
    gap: 18,
  },
});
