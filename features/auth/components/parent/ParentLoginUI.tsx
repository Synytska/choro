import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RedirectAuth } from "@/components/ui/RedirectAuth";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { tabBarHeight } from "@/lib/constants";

import { Header } from "./Header";
import LoginForm from "./LoginForm";
import { styles } from "./styles";

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
    <KeyboardAwareScrollView
      bottomOffset={62}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
    >
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
    </KeyboardAwareScrollView>
  );
}
