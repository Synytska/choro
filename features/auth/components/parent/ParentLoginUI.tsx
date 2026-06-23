import ParentIcon from "@/assets/svg-icons/ParentIcon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import LoginForm from "./LoginForm";

export default function ParentLoginUI() {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.iconWrapper}>
          <ParentIcon color={Colors.black} style={styles.icon} />
        </ThemedView>
        <View style={styles.textWrapper}>
          <ThemedText style={styles.header}>{t("parentAccess")}</ThemedText>
          <ThemedText style={styles.subtitle}>{t("parentSubtitle")}</ThemedText>
        </View>
        <ThemedView style={styles.form}>
          <LoginForm />
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
    backgroundColor: Colors.lightGrey,
    borderRadius: 50,
    padding: 22,
  },
  icon: {
    width: 36,
    height: 36,
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
    color: Colors.darkGrey,
  },
  form: {
    alignSelf: "stretch",
  },
});
