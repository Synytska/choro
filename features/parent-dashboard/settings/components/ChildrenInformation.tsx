import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { useAppColors } from "@/hooks/use-app-colors";
import { ChildCard } from "@/lib/types";

import { styles } from "../styles";
import { SettingsChildrenSkeleton } from "./SettingsSkeleton";

type ChildrenInformationProps = {
  kids: ChildCard[];
  isLoading?: boolean;
};

function CustomSubtitle({
  onPress,
  isCopied,
  childCode,
}: {
  onPress: () => void;
  isCopied: boolean;
  childCode: string;
}) {
  const colors = useAppColors();
  const { t } = useTranslation();

  return (
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Copy child code"
        onPress={onPress}
        style={[styles.commonWrapper]}
      >
        <ThemedText type="subtitle">
          {t("common.childCode")}{" "}
          <Text style={[styles.codeText, { color: colors.darkNavy }]}>{childCode}</Text>
        </ThemedText>
        <AppIcon icon={isCopied ? Icons.check : Icons.copy} size={18} color={colors.darkNavy} />
      </TouchableOpacity>
    </View>
  );
}

export function ChildrenInformation({ kids, isLoading = false }: ChildrenInformationProps) {
  const router = useRouter();
  const colors = useAppColors();
  const { t } = useTranslation();

  const [copiedChildId, setCopiedChildId] = useState<string | null>(null);

  const handleCopy = async (childId: string, childCode: string) => {
    await Clipboard.setStringAsync(childCode);
    setCopiedChildId(childId);

    setTimeout(() => {
      setCopiedChildId((currentId) => (currentId === childId ? null : currentId));
    }, 1500);
  };

  const onEditChildPress = (id: string) => {
    router.push({
      pathname: "/edit-child-modal",
      params: { id },
    });
  };

  const onCreateChildPress = () => {
    router.push("/add-child-modal");
  };

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.commonWrapper}>
        <ThemedText style={styles.sectionHeader}>{t("common.children")}</ThemedText>
        <IconButton
          onPress={onCreateChildPress}
          size={24}
          iconSize={24}
          borderColor={colors.darkGrey}
        />
      </View>

      {isLoading ? (
        <SettingsChildrenSkeleton />
      ) : kids.length ? (
        kids.map((child) => {
          const isCopied = copiedChildId === child.id;

          return (
            <ReusableCard
              key={child.id}
              title={child.name}
              image={ChoroImages.kidAvatar}
              customSubtitle={
                <CustomSubtitle
                  onPress={() => handleCopy(child.id, child.loginCode)}
                  isCopied={isCopied}
                  childCode={child.loginCode}
                />
              }
              aditionalContent={
                <TouchableOpacity onPress={() => onEditChildPress(child.id)}>
                  <AppIcon icon={Icons.pencil} size={22} />
                </TouchableOpacity>
              }
            />
          );
        })
      ) : (
        <ThemedText type="subtitle">No children yet.</ThemedText>
      )}
    </View>
  );
}
