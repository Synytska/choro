import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { SettingsChildrenSkeleton } from "@/components/ui/skeletons/parents/SettingsSkeleton";
import { Palette } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ChildCard } from "@/lib/types";
import { getChildAvatarImage } from "@/lib/utils/utils";

import { styles } from "../styles";

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
  const { t } = useTranslation();
  const icon = useThemeColor({}, "icon");

  return (
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Copy child code"
        onPress={onPress}
        style={[styles.commonWrapper]}
      >
        <ThemedText type="subtitle">
          {t("common.childCode")} <ThemedText style={styles.codeText}>{childCode}</ThemedText>
        </ThemedText>
        <AppIcon icon={isCopied ? Icons.check : Icons.copy} size={18} color={icon} />
      </TouchableOpacity>
    </View>
  );
}

export function ChildrenInformation({ kids, isLoading = false }: ChildrenInformationProps) {
  const router = useRouter();
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
          borderColor={Palette.darkGrey}
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
              image={getChildAvatarImage(child.avatarId, child.avatarUrl)}
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
