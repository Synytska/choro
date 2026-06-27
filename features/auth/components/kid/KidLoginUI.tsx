import { ChoroImages } from "@/assets/images";
import Logo from "@/assets/svg-icons/Logo";
import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/theme";
import { useAppColors } from "@/hooks/use-app-colors";
import { Image } from "expo-image";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import GridOverlay from "../../../../components/ui/GridOverlay";
import KidLoginForm from "./KidLoginForm";
import { useTranslation } from "react-i18next";
import PageView from "@/components/ui/PageView";

export default function KidLoginUI() {
  const { width } = useWindowDimensions();
  const colors = useAppColors();
  const { t } = useTranslation();

  const dynamicStyles = StyleSheet.create({
    screen: {
      backgroundColor: colors.darkBlue,
    },
  });

  return (
    <View style={[styles.screen, dynamicStyles.screen]}>
      <GridOverlay width={width} withStars />

      <PageView>
        <Logo textColor={colors.lightGrey} />

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.wrapper}>
            <Image source={ChoroImages.kidAvatar} style={styles.avatar} />

            <View style={styles.textWrapper}>
              <ThemedText
                type="title"
                lightColor={colors.white}
                style={styles.title}
              >
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
