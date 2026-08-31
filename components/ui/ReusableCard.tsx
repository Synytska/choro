/** Change this
 * Active task row used on the parent home dashboard.
 *
 * Props:
 * - task: title, time, and done/pending status to render.
 * - index: selects a temporary avatar background color.
 */

import { Image, ImageSource, ImageStyle } from "expo-image";
import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import { useThemeColor } from "@/hooks/use-theme-color";

import { CountBadge } from "./CountBadge";

type ReusableCardProps = {
  image: ImageSource;
  title: string;
  subtitle?: string;
  customSubtitle?: ReactNode;
  aditionalContent?: ReactNode;
  onPress?: () => void;
  emoji?: string;
  styleTitle?: StyleProp<TextStyle>;
  styleSubtitle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  badgeValue?: number;
};

export function ReusableCard({
  image,
  title,
  subtitle,
  customSubtitle,
  aditionalContent,
  onPress,
  emoji,
  styleTitle,
  styleSubtitle,
  style,
  imageStyle,
  badgeValue,
}: ReusableCardProps) {
  const background = useThemeColor({}, "background");

  const dynamicStyles = StyleSheet.create({
    taskCard: {
      backgroundColor: background,
      shadowColor: Palette.darkNavy,
    },
    taskTime: {
      color: Palette.darkGrey,
    },
    doneBadge: {
      backgroundColor: Palette.lightGreen,
    },
    pendingBadge: {
      backgroundColor: Palette.lightYellow,
    },
    doneBadgeText: {
      color: Palette.darkGreen,
    },
    pendingBadgeText: {
      color: Palette.orange,
    },
  });

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <ThemedView style={[styles.card, dynamicStyles.taskCard, globalStyles.shadow, style]}>
        <View style={styles.taskLeft}>
          <View>
            {badgeValue && <CountBadge title={badgeValue} />}

            <View style={[styles.avatar]}>
              <Image source={image} style={[styles.avatarImage, imageStyle]} contentFit="cover" />
            </View>
          </View>
          <View style={styles.taskCopy}>
            <View style={styles.emojiWrapper}>
              <ThemedText style={[styles.taskTitle, styleTitle]}>{title}</ThemedText>
              {emoji && <Text>{emoji}</Text>}
            </View>
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
    borderRadius: 50,
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
  emojiWrapper: {
    flexDirection: "row",
    gap: 6,
  },
});
