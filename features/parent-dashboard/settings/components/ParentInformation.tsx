import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { CustomImagePicker } from "@/components/ui/ImagePicker";
import { Input } from "@/components/ui/Input";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

import { styles } from "../styles";

type ParentInformationProps = {
  initials: string;
  avatarUri: string;
  handlePickAvatar: () => void;
  userName: string;
  setUserName: (value: string) => void;
  inputDisabled: {
    name: boolean;
    email: boolean;
  };
  onEditName: () => void;
  userEmail: string;
  setUserEmail: (value: string) => void;
  onEditEmail: () => void;
  onChangePasswordPress: () => void;
};

export function ParentInformation({
  initials,
  avatarUri,
  handlePickAvatar,
  userName,
  setUserName,
  inputDisabled,
  onEditName,
  userEmail,
  setUserEmail,
  onEditEmail,
  onChangePasswordPress,
}: ParentInformationProps) {
  const colors = useAppColors();
  const { t } = useTranslation();

  const getDisabledUI = (disabled: boolean) => {
    if (disabled) {
      return {
        icon: Icons.pencil,
        color: colors.darkGrey,
      };
    }
    return {
      icon: Icons.check,
      color: colors.darkGreen,
    };
  };

  const nameAction = getDisabledUI(inputDisabled.name);
  const emailAction = getDisabledUI(inputDisabled.email);

  return (
    <View style={styles.contentWrapper}>
      <ThemedText style={styles.sectionHeader}>{t("parent.settings.parentInfo")}</ThemedText>

      <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
        <CustomImagePicker
          customText={initials}
          customTextStyle={styles.customText}
          uri={avatarUri}
          onPress={handlePickAvatar}
        />

        <Input
          style={[styles.input, { borderBottomColor: colors.lightGrey }]}
          label={t("common.name")}
          placeholder={t("parent.settings.enterNewName")}
          value={userName}
          onChangeText={setUserName}
          disabled={inputDisabled.name}
          icon={<AppIcon icon={nameAction.icon} size={22} color={nameAction.color} />}
          iconOnPress={onEditName}
        />
        <Input
          style={[styles.input, { borderBottomColor: colors.lightGrey }]}
          label={t("common.email")}
          placeholder={t("parent.settings.enterNewEmail")}
          value={userEmail}
          onChangeText={setUserEmail}
          disabled={inputDisabled.email}
          icon={<AppIcon icon={emailAction.icon} size={22} color={emailAction.color} />}
          iconOnPress={onEditEmail}
        />
        <TouchableOpacity onPress={onChangePasswordPress} style={styles.changePassContainer}>
          <View style={styles.changePassWrapper}>
            <AppIcon icon={Icons.lock} size={22} />
            <ThemedText style={styles.title}>{t("parent.settings.changePass")}</ThemedText>
          </View>
          <AppIcon icon={Icons.chevronRight} />
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}
