import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import ParentIcon from "@/assets/svg-icons/ParentIcon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RedirectAuth } from "@/components/ui/RedirectAuth";
import { useAppColors } from "@/hooks/use-app-colors";

import LoginForm from "./LoginForm";

export default function ParentLoginUI() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    iconWrapper: {
      backgroundColor: colors.lightGrey,
    },
    subtitle: {
      color: colors.darkGrey,
    },
  });

  const onSignUpPress = () => {
    router.push("/(auth)/parent-signup");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
          <ParentIcon color={colors.black} style={styles.icon} />
        </ThemedView>
        <View style={styles.textWrapper}>
          <ThemedText style={styles.header}>{t("auth.parent.title")}</ThemedText>
          <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
            {t("auth.parent.subtitle")}
          </ThemedText>
        </View>
        <ThemedView style={styles.form}>
          <LoginForm />
          <RedirectAuth
            title={t("auth.parent.redirectSignup")}
            textLink={t("auth.parent.signUp")}
            onPress={onSignUpPress}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
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
