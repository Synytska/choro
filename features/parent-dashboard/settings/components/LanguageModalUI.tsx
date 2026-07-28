import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import PageView from "@/components/ui/PageView";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { languageOptions, role } from "@/lib/constants";
import { AppLanguage } from "@/lib/types";
import { normalizeLanguage } from "@/lib/utils/utils";

import { useUpdateLanguage } from "../hooks/useUpdateLanguage";

export function LanguageModalUI() {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const updateLanguage = useUpdateLanguage();

  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(() =>
    normalizeLanguage(profile?.language),
  );

  useEffect(() => {
    setSelectedLanguage(normalizeLanguage(profile?.language));
  }, [profile?.language]);

  const currentLanguage = normalizeLanguage(profile?.language);
  const hasChanges = selectedLanguage !== currentLanguage;

  const onSave = () => {
    updateLanguage.mutate(selectedLanguage, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <PageView
      modal
      screen={role.parent}
      buttons={[
        {
          title: t("parent.settings.languageModal.save"),
          onPress: onSave,
          disabled: !hasChanges || updateLanguage.isPending,
        },
        {
          title: t("common.cancel"),
          onPress: () => router.back(),
          variant: "outline",
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>
            {t("parent.settings.languageModal.title")}
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            {t("parent.settings.languageModal.subtitle")}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.list}>
            {languageOptions.map((option) => {
              const isSelected = option.code === selectedLanguage;

              return (
                <Pressable
                  key={option.code}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedLanguage(option.code)}
                  style={[
                    styles.option,
                    globalStyles.shadow,
                    {
                      borderColor: isSelected ? colors.orange : colors.lightGrey,
                      backgroundColor: colors.white,
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.flagWrapper, { backgroundColor: colors.lightGrey }]}>
                      <Text style={styles.flag}>{option.flag}</Text>
                    </View>
                    <View>
                      <ThemedText style={styles.optionTitle}>{option.nativeLabel}</ThemedText>
                      <ThemedText type="subtitle" style={styles.optionSubtitle}>
                        {option.label}
                      </ThemedText>
                    </View>
                  </View>

                  <AppIcon
                    icon={isSelected ? Icons.radioOn : Icons.radioOff}
                    size={28}
                    color={isSelected ? colors.orange : colors.darkGrey}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 28,
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    alignSelf: "center",
  },
  content: {
    gap: 20,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  list: {
    gap: 12,
  },
  option: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  flagWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  flag: {
    fontSize: 28,
  },
  optionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
  },
  optionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
