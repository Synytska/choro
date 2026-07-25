import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { AchievementProgressItem } from "@/lib/types";

import MiniButton from "./MiniButton";

export default function Achievements({ data }: { data: AchievementProgressItem[] }) {
  const colors = useAppColors();

  const [moreCardId, setMoreCardId] = useState("");

  const renderItem = ({ item }: { item: AchievementProgressItem }) => {
    const isMoreCardVisible = item.id === moreCardId;
    const isUnavailable = Boolean(item.unavailableReason);
    const borderColor = item.unlocked ? colors.yellow : colors.darkGrey;
    const buttonBackground = item.unlocked
      ? //TODO: Add green color only if award was already taken
        colors.orange
      : colors.darkGrey;

    //TODO: if award was already taken text will be claimed
    const buttonTitle = item.unlocked ? "claim" : isUnavailable ? "soon" : "claim";

    return (
      <ThemedView child style={[styles.wrapper, { borderColor }]}>
        <View style={[styles.iconWrapper, { borderColor }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <TouchableOpacity
          hitSlop={30}
          onPress={() => setMoreCardId(item.id)}
          style={styles.moreIcon}
        >
          <AppIcon icon={Icons.more} color={colors.middleGrey} size={20} />
        </TouchableOpacity>

        <ThemedText child style={[styles.title, { color: colors.white }]}>
          {item.title}
        </ThemedText>

        <View style={styles.progressWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: colors.borderBlue }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.yellow, width: `${item.progress * 100}%` },
              ]}
            />
          </View>
          <ThemedText child style={[styles.progressText, { color: colors.middleGrey }]}>
            {item.progressLabel}
          </ThemedText>
        </View>

        <MiniButton
          buttonStyle={[styles.button, { backgroundColor: buttonBackground }]}
          textStyle={[styles.buttonText, { color: colors.white }]}
          title={buttonTitle}
          disabled={!item.unlocked}
        />

        {isMoreCardVisible && (
          <View
            style={[StyleSheet.absoluteFill, styles.moreCard, { backgroundColor: colors.orange }]}
          >
            <IconButton
              icon={Icons.close}
              size={20}
              iconSize={20}
              borderColor={colors.darkNavy}
              onPress={() => setMoreCardId("")}
            />
            <ThemedText child style={[styles.moreText]}>
              {item.description}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    );
  };

  return (
    <CustomFlatList
      contentContainerStyle={styles.flatList}
      keyExtractor={(item) => item.id}
      data={data}
      renderItem={renderItem}
      horizontal
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: 194,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    flexWrap: "wrap",
    textAlign: "center",
  },
  flatList: {
    gap: 12,
  },
  progressWrapper: {
    width: "100%",
    gap: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 14,
  },
  moreIcon: {
    position: "absolute",
    right: 10,
    top: 6,
  },
  moreCard: {
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    opacity: 0.9,
  },
  moreText: {
    fontSize: 20,
    lineHeight: 22,
  },
});
