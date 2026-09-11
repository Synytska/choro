import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import LogoSmall from "@/assets/svg-icons/LogoSmall";

import { ThemedText } from "../themed-text";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
};

export function Header({ title, subtitle, icon }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoWrapper}>
        <LogoSmall />
        <View style={styles.headerWrapper}>
          <ThemedText style={styles.greeting}>{title}</ThemedText>
          {subtitle && <ThemedText type="subtitle">{subtitle}</ThemedText>}
        </View>
      </View>

      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  headerWrapper: {
    gap: 4,
  },
  greeting: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "800",
  },
});
