/** Change this
 * Active task row used on the parent home dashboard.
 *
 * Props:
 * - task: title, time, and done/pending status to render.
 * - index: selects a temporary avatar background color.
 */

import { Image, ImageSource, ImageStyle } from "expo-image";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";

type ReusableCard = {
  image: ImageSource;
  title: string;
  subtitle?: string;
  customSubtitle?: ReactNode;
  aditionalContent?: ReactNode;
  onPress?: () => void;
  styleTitle?: StyleProp<TextStyle>;
  styleSubtitle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export function ReusableCard({
  image,
  title,
  subtitle,
  customSubtitle,
  aditionalContent,
  onPress,
  styleTitle,
  styleSubtitle,
  style,
  imageStyle,
}: ReusableCard) {
  const { t } = useTranslation();
  const colors = useAppColors();

  const dynamicStyles = StyleSheet.create({
    taskCard: {
      backgroundColor: colors.background,
      shadowColor: colors.darkNavy,
    },
    taskTime: {
      color: colors.darkGrey,
    },
    doneBadge: {
      backgroundColor: colors.lightGreen,
    },
    pendingBadge: {
      backgroundColor: colors.lightYellow,
    },
    doneBadgeText: {
      color: colors.darkGreen,
    },
    pendingBadgeText: {
      color: colors.orange,
    },
  });

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <ThemedView style={[styles.card, dynamicStyles.taskCard, globalStyles.shadow, style]}>
        <View style={styles.taskLeft}>
          <View style={[styles.avatar]}>
            <Image source={image} style={[styles.avatarImage, imageStyle]} contentFit="cover" />
          </View>
          <View style={styles.taskCopy}>
            <ThemedText style={[styles.taskTitle, styleTitle]}>{title}</ThemedText>
            {customSubtitle ? (
              customSubtitle
            ) : (
              <ThemedText type="subtitle" style={[styles.taskTime, styleSubtitle]}>
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>

        {aditionalContent}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 25,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  taskCopy: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
  },
  taskTime: {
    fontSize: 13,
    lineHeight: 15,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
