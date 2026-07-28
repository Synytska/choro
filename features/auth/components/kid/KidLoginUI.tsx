import { Image } from "expo-image";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import Logo from "@/assets/svg-icons/Logo";
import { ThemedText } from "@/components/themed-text";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { role } from "@/lib/constants";

import GridOverlay from "../../../../components/ui/GridOverlay";
import KidLoginForm from "./KidLoginForm";

export default function KidLoginUI() {
  const { width } = useWindowDimensions();
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <PageView screen={role.kidLogin}>
      <Logo textColor={colors.lightGrey} />

      <CustomScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.wrapper}>
          <Image
            source={ChoroImages.kidAvatar}
            style={[styles.avatar, globalStyles.kidShadow, { shadowColor: colors.green }]}
          />

          <View style={styles.textWrapper}>
            <ThemedText mono type="title" lightColor={colors.white} style={styles.title}>
              {t("auth.kid.title")}
            </ThemedText>
            <ThemedText mono lightColor={colors.green}>
              {t("auth.kid.subtitle")}
            </ThemedText>
          </View>

          <KidLoginForm />
        </View>
      </CustomScrollView>
      <GridOverlay width={width} withStars />
    </PageView>
  );
}

const styles = StyleSheet.create({
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
    textTransform: "uppercase",
    fontWeight: 600,
  },
});
