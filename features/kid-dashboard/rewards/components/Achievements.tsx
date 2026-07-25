import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CustomFlatList } from "@/components/FlatList";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { IconButton } from "@/components/ui/IconButton";
import { useAppColors } from "@/hooks/use-app-colors";
import { AchievementItem } from "@/lib/types";

import MiniButton from "./MiniButton";

export default function Achievements({ data }: { data: AchievementItem[] }) {
  const colors = useAppColors();

  const [moreCardId, setMoreCardId] = useState("");

  const dynamicStyles = StyleSheet.create({
    wrapper: {
      //TODO: Yellow - if claimed
      // Grey if unclaimed
      borderColor: colors.yellow,
    },
    text: {
      color: colors.white,
    },
    button: {
      //TODO: Green if award already claimed
      //Grey if user still can't claim award
      // Orange if can claim
      backgroundColor: colors.orange,
    },
    buttonText: {
      //TODO: Black if award already claimed
      //White - if can claim
      //Grey if user still can't claim award
      color: colors.white,
    },
    iconWrapper: {
      borderColor: colors.yellow,
    },
    moreCard: {
      backgroundColor: colors.orange,
    },
  });

  const renderItem = ({ item }: { item: AchievementItem }) => {
    const isMoreCardVisible = item.id === moreCardId;

    return (
      <ThemedView child style={[styles.wrapper, dynamicStyles.wrapper]}>
        <View style={[styles.iconWrapper, dynamicStyles.iconWrapper]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <TouchableOpacity
          hitSlop={30}
          onPress={() => setMoreCardId(item.id)}
          style={styles.moreIcon}
        >
          <AppIcon icon={Icons.more} color={colors.middleGrey} size={20} />
        </TouchableOpacity>

        <ThemedText child style={[styles.title, dynamicStyles.text]}>
          {item.title}
        </ThemedText>

        <MiniButton
          buttonStyle={[dynamicStyles.button, styles.button]}
          textStyle={[dynamicStyles.buttonText, styles.buttonText]}
          //TODO: disabled if user can't claim an award
          // disabled={!allowRedeem}
          //Localize and add second option - claimed
          title={"claim"}
        />

        {/* TODO: Show if already claimed??? */}
        {isMoreCardVisible && (
          <View style={[StyleSheet.absoluteFill, styles.moreCard, dynamicStyles.moreCard]}>
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
  },
  flatList: {
    gap: 12,
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
