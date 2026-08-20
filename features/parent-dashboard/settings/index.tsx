import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { role } from "@/lib/constants";
import { pickImage } from "@/lib/utils/image-picker";
import { getInitials } from "@/lib/utils/utils";

import { useChildren } from "../children/hooks/useChildren";
import { AppSettings } from "./components/AppSettings";
import { ChildrenInformation } from "./components/ChildrenInformation";
import { ParentInformation } from "./components/ParentInformation";
import { Support } from "./components/Support";
import { useUpdateProfileSettings } from "./hooks/useUpdateProfileSettings";
import { styles } from "./styles";

export function ParentSettingsUI() {
  const router = useRouter();
  const { t } = useTranslation();

  const { data: profile, refetch: refetchProfile } = useProfile();
  const {
    data: childrenData,
    isLoading: isChildrenLoading,
    refetch: refetchChildren,
  } = useChildren();
  const updateProfileSettings = useUpdateProfileSettings();

  const [avatarUri, setAvatarUri] = useState<string>("");
  const [avatarMimeType, setAvatarMimeType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [inputDisabled, setInputDisabled] = useState({
    name: true,
    email: true,
  });

  useEffect(() => {
    if (!profile) return;

    setUserName(profile.name);
    setUserEmail(profile.email);
    setAvatarUri(profile.avatar_url ?? "");
    setAvatarMimeType(null);
  }, [profile]);

  const initials = getInitials(userName || profile?.name || "");

  const profileChanges = useMemo(() => {
    const nextName = userName.trim();
    const nextEmail = userEmail.trim();
    const currentName = profile?.name ?? "";
    const currentEmail = profile?.email ?? "";
    const currentAvatarUri = profile?.avatar_url ?? "";

    return {
      nameChanged: Boolean(profile) && nextName !== currentName,
      emailChanged: Boolean(profile) && nextEmail !== currentEmail,
      avatarChanged: Boolean(profile) && avatarUri !== currentAvatarUri,
    };
  }, [avatarUri, profile, userEmail, userName]);

  const hasChanges =
    profileChanges.nameChanged || profileChanges.emailChanged || profileChanges.avatarChanged;

  const handlePickAvatar = async () => {
    const image = await pickImage();

    if (!image) return;

    setAvatarUri(image.uri);
    setAvatarMimeType(image.mimeType ?? null);
  };

  const onEditName = () => {
    setInputDisabled((prev) => ({
      ...prev,
      name: !inputDisabled.name,
    }));
  };

  const onEditEmail = () => {
    setInputDisabled((prev) => ({
      ...prev,
      email: !inputDisabled.email,
    }));
  };

  const onChangePasswordPress = () => {
    router.push("/change-password-modal");
  };

  const onSaveChanges = () => {
    if (!profile || !hasChanges) return;

    updateProfileSettings.mutate(
      {
        name: profileChanges.nameChanged ? userName : undefined,
        email: profileChanges.emailChanged ? userEmail : undefined,
        avatarUri: profileChanges.avatarChanged ? avatarUri : undefined,
        avatarMimeType,
      },
      {
        onSuccess: () => {
          setInputDisabled({
            name: true,
            email: true,
          });
        },
      },
    );
  };

  const refreshControl = usePullToRefresh({
    onRefresh: () => Promise.all([refetchProfile(), refetchChildren()]),
  });

  return (
    <PageView screen={role.parent}>
      <Header title={t("common.settings")} />

      <CustomScrollView
        contentContainerStyle={styles.scrollView}
        refreshing={refreshControl.refreshing}
        onRefresh={refreshControl.onRefresh}
      >
        <ParentInformation
          initials={initials ?? ""}
          avatarUri={avatarUri}
          handlePickAvatar={handlePickAvatar}
          userName={userName}
          setUserName={setUserName}
          inputDisabled={inputDisabled}
          onEditName={onEditName}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          onEditEmail={onEditEmail}
          onChangePasswordPress={onChangePasswordPress}
        />

        <ChildrenInformation kids={childrenData?.children ?? []} isLoading={isChildrenLoading} />

        <AppSettings />

        <Support />

        <Button
          onPress={onSaveChanges}
          disabled={!hasChanges || updateProfileSettings.isPending}
          loading={updateProfileSettings.isPending}
        >
          {t("common.saveChanges")}
        </Button>
      </CustomScrollView>
    </PageView>
  );
}
