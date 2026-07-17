import { Image } from "expo-image";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import Logo from "@/assets/svg-icons/Logo";
import { ThemedText } from "@/components/themed-text";
import PageView from "@/components/ui/PageView";
import { Fonts } from "@/constants/theme";
import { useAppColors } from "@/hooks/use-app-colors";
import { role } from "@/lib/constants";

import GridOverlay from "../../../../components/ui/GridOverlay";
import KidLoginForm from "./KidLoginForm";

export default function KidLoginUI() {
  const { width } = useWindowDimensions();
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <PageView screen={role.kid}>
        <Logo textColor={colors.lightGrey} />

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.wrapper}>
            <Image source={ChoroImages.kidAvatar} style={styles.avatar} />

            <View style={styles.textWrapper}>
              <ThemedText type="title" lightColor={colors.white} style={styles.title}>
                {t("auth.kid.title")}
              </ThemedText>
              <ThemedText lightColor={colors.green} style={styles.subtitle}>
                {t("auth.kid.subtitle")}
              </ThemedText>
            </View>

            <KidLoginForm />
          </View>
        </ScrollView>
      </PageView>

      <GridOverlay width={width} withStars />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: 50,
  },
  wrapper: {
    alignItems: "center",
    gap: 48,
  },
  avatar: {
    width: 160,
    height: 160,
    alignSelf: "center",
  },
  textWrapper: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: Fonts.mono,
    textTransform: "uppercase",
    fontWeight: 600,
  },
  subtitle: {
    fontFamily: Fonts.mono,
  },
});
