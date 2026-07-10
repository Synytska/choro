import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { globalStyles } from "@/features/styles";
import { pickImage } from "@/lib/utils/image-picker";
import { getInitials } from "@/lib/utils/utils";

import { useChildren } from "../children/hooks/useChildren";
import { AppSettings } from "./components/AppSettings";
import { ChildrenInformation } from "./components/ChildrenInformation";
import { ParentInformation } from "./components/ParentInformation";

export function ParentSettingsUI() {
  const router = useRouter();

  const { data: profile } = useProfile();
  const { data: childrenData, isLoading: isChildrenLoading } = useChildren();

  const [avatarUri, setAvatarUri] = useState<string>("");
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
  }, [profile]);

  const initials = getInitials(profile?.name);

  const handlePickAvatar = async () => {
    const image = await pickImage();

    if (!image) return;

    setAvatarUri(image.uri);
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

  return (
    <PageView background="parent">
      <Header title={"Settings"} />

      <CustomScrollView contentContainerStyle={styles.scrollView}>
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

        <View style={styles.contentWrapper}>
          <ThemedText style={styles.sectionHeader}>Support</ThemedText>

          <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.chat} size={22} />
                <TouchableOpacity>
                  <ThemedText style={[styles.title]}>Contact Us</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.safety} size={22} />
                <TouchableOpacity>
                  <ThemedText style={[styles.title]}>Privacy Policy</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.document} size={22} />
                <TouchableOpacity>
                  <ThemedText style={[styles.title]}>Terms</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.appSettingsContent}>
              <AppIcon icon={Icons.star} size={22} />
              <TouchableOpacity>
                <ThemedText style={[styles.title]}>Leave feedback in AppStore</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>

        <Button onPress={() => {}}>Save changes</Button>
      </CustomScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 24,
    gap: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  sectionWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    gap: 16,
  },
  contentWrapper: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
  appSettingsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  appSettingsContent: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});
