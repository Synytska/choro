import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ParentIcon from "@/assets/svg-icons/ParentIcon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RedirectAuth } from "@/components/ui/RedirectAuth";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useAppColors } from "@/hooks/use-app-colors";
import { tabBarHeight } from "@/lib/constants";

import SignUpForm from "./SignUpForm";

export default function ParentSignUpUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dynamicStyles = StyleSheet.create({
    iconWrapper: {
      backgroundColor: colors.lightGrey,
    },
    subtitle: {
      color: colors.darkGrey,
    },
    scrollContent: {
      paddingBottom: insets.bottom + tabBarHeight,
    },
  });

  const onSignInPress = () => {
    router.back();
  };

  return (
    <CustomScrollView contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
          <ParentIcon color={colors.black} style={styles.icon} />
        </ThemedView>
        <View style={styles.textWrapper}>
          <ThemedText style={styles.header}>{t("auth.parent.signupTitle")}</ThemedText>
          <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
            {t("auth.parent.signupSubtitle")}
          </ThemedText>
        </View>
        <ThemedView style={styles.form}>
          <SignUpForm />
          <RedirectAuth
            title={t("auth.parent.redirectSignin")}
            textLink={t("auth.parent.signIn")}
            onPress={onSignInPress}
          />
        </ThemedView>
      </ThemedView>
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
  iconWrapper: {
    borderRadius: 50,
    padding: 22,
  },
  icon: {
    width: 50,
    height: 50,
  },
  textWrapper: {
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    alignSelf: "stretch",
    gap: 18,
  },
});
