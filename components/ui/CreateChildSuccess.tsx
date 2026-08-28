/**
 * Success state shown after a child profile is created.
 *
 * Props:
 * - childName: displayed in the success title.
 * - childCode: login code shown to the parent and copied to clipboard on press.
 */
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import CheckIcon from "@/assets/svg-icons/CheckIcon";
import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";
import { AppIcon, Icons } from "./AppIcon";

export function CreateChildSuccess({
  childName,
  childCode,
}: {
  childName: string;
  childCode: string;
}) {
  const { t } = useTranslation();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(childCode);
    setIsCopied(true);
  };

  return (
    <View style={[styles.content, styles.successContent]}>
      <ThemedText style={styles.title}>
        {t("onboarding.finish.title", { name: childName })}
      </ThemedText>
      <CheckIcon style={styles.checkIcon} />
      <View style={styles.codeSection}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Copy child code"
          onPress={handleCopy}
          style={styles.codeCard}
        >
          <ThemedText style={styles.codeText}>
            {t("common.childCode")} {childCode}
          </ThemedText>
          <AppIcon icon={isCopied ? Icons.check : Icons.copy} size={20} color={Palette.darkNavy} />
        </Pressable>
        <ThemedText type="subtitle">{t("onboarding.finish.subtitle")}</ThemedText>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  content: {
    gap: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    textAlign: "center",
  },
  successContent: {
    alignItems: "center",
    paddingTop: 40,
    flex: 1,
  },
  codeSection: {
    width: "100%",
    gap: 12,
  },
  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    backgroundColor: Palette.lightGrey,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    color: Palette.darkNavy,
  },
  checkIcon: {
    width: 140,
    height: 140,
  },
});
