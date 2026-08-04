import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RedirectAuth } from "@/components/ui/RedirectAuth";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { tabBarHeight } from "@/lib/constants";

import { Header } from "./Header";
import SignUpForm from "./SignUpForm";
import { styles } from "./styles";

export default function ParentSignUpUI() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dynamicStyles = StyleSheet.create({
    scrollContent: {
      paddingBottom: insets.bottom + tabBarHeight,
    },
  });

  const onSignInPress = () => {
    router.back();
  };

  return (
    <CustomScrollView contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}>
      <View style={styles.container}>
        <Header title={t("auth.parent.signupTitle")} subtitle={t("auth.parent.signupSubtitle")} />

        <View style={styles.form}>
          <SignUpForm />
          <RedirectAuth
            title={t("auth.parent.redirectSignin")}
            textLink={t("auth.parent.signIn")}
            onPress={onSignInPress}
          />
        </View>
      </View>
    </CustomScrollView>
  );
}
