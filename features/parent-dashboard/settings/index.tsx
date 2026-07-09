import { ScrollView, StyleSheet, Switch, View } from "react-native";

import { ChoroImages } from "@/assets/images";
import LogoSmall from "@/assets/svg-icons/LogoSmall";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import PageView from "@/components/ui/PageView";
import { ReusableCard } from "@/components/ui/ReusableCard";
import { Fonts } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

export function ParentSettingsUI() {
  const colors = useAppColors();

  return (
    <PageView background="parent">
      {/* Header */}
      <View style={styles.logoWrapper}>
        <LogoSmall />
        <ThemedText style={styles.header}>{"Settings"}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <ThemedText style={styles.sectionHeader}>Parent Information</ThemedText>

          <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
            <View style={styles.photoContainer}>
              <View style={[styles.photo, { backgroundColor: colors.middleGrey }]} />
              <View style={[styles.iconContainer, { backgroundColor: colors.white }]}>
                <View style={[styles.iconWrapper, { backgroundColor: colors.orange }]}>
                  <AppIcon icon={Icons.camera} size={16} color={colors.white} />
                </View>
              </View>
            </View>

            <Input
              style={[styles.input, { borderBottomColor: colors.lightGrey }]}
              label="Name"
              placeholder="test"
              value="Sara R"
              onChangeText={() => {}}
              icon={<AppIcon icon={Icons.pencil} size={30} />}
            />
            <Input
              style={[styles.input, { borderBottomColor: colors.lightGrey }]}
              label="Email"
              placeholder="test"
              value="test@tes.ua"
              onChangeText={() => {}}
              icon={<AppIcon icon={Icons.pencil} size={30} />}
            />
            <ThemedText style={styles.title}>Change Password</ThemedText>
          </ThemedView>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.childrenSectWrapper}>
            <ThemedText style={styles.sectionHeader}>Children</ThemedText>
            <IconButton onPress={() => {}} size={26} iconSize={18} />
          </View>
          <ReusableCard
            title="Sara"
            image={ChoroImages.kidAvatar}
            subtitle="Child Code: 345678"
            aditionalContent={<AppIcon icon={Icons.pencil} size={30} />}
          />
        </View>

        <View style={styles.contentWrapper}>
          <ThemedText style={styles.sectionHeader}>App Settings</ThemedText>

          <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.notification} size={22} />
                <ThemedText style={styles.title}>Child Notifications</ThemedText>
              </View>
              <Switch />
            </View>

            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.notification} size={22} />
                <ThemedText style={styles.title}>Parent Notifications</ThemedText>
              </View>
              <Switch />
            </View>

            <View style={styles.appSettingsWrapper}>
              <View style={styles.appSettingsContent}>
                <AppIcon icon={Icons.language} size={22} />
                <ThemedText style={styles.title}>Language</ThemedText>
              </View>

              <ThemedText>English</ThemedText>
            </View>

            <View style={styles.appSettingsContent}>
              <AppIcon icon={Icons.logout} size={22} color={colors.error} />
              <ThemedText style={[styles.title, { color: colors.error }]}>Logout</ThemedText>
            </View>

            <View style={styles.appSettingsContent}>
              <AppIcon icon={Icons.bin} size={22} color={colors.error} />
              <ThemedText style={[styles.title, { color: colors.error }]}>
                Delete Account
              </ThemedText>
            </View>
          </ThemedView>
        </View>

        <View style={styles.contentWrapper}>
          <ThemedText style={styles.sectionHeader}>Support</ThemedText>

          <ThemedView style={[globalStyles.shadow, styles.sectionWrapper]}>
            <ThemedText style={styles.title}>Contact us</ThemedText>
            <ThemedText style={styles.title}>Privacy Policy</ThemedText>
            <ThemedText style={styles.title}>Terms</ThemedText>
            <ThemedText style={styles.title}>Leave feedback in AppStore</ThemedText>
          </ThemedView>
        </View>

        <Button onPress={() => {}}>Save changes</Button>
      </ScrollView>
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
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  header: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
  },
  contentWrapper: {
    gap: 12,
  },
  photoContainer: {
    position: "relative",
    alignItems: "center",
    alignSelf: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 50,
    padding: 2,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderWidth: 0,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  childrenSectWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
  appSettingsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appSettingsContent: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});
