import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";

import { SkeletonBlock } from "../SkeletonBlock";
import { styles } from "./styles";
import { TasksSkeleton } from "./TasksSkeleton";

export function ChildRewardsScreenSkeleton() {
  return (
    <View style={styles.gap16}>
      <SkeletonBlock width={159} height={31} child />
      <BalanceCardSkeleton />
      <SkeletonBlock width={159} height={31} child />
      <TasksSkeleton />
      <SkeletonBlock width={159} height={31} child />
      <AchievementsCardSkeleton />
    </View>
  );
}

function BalanceCardSkeleton() {
  return (
    <ThemedView child style={styles.balanceCard}>
      <View style={styles.container}>
        <View style={styles.balance}>
          <SkeletonBlock width={32} height={32} child />
          <SkeletonBlock width={116} height={21} child />
        </View>
        <SkeletonBlock width={68} height={37} radius="round" child />
      </View>
      <View style={styles.rewardWrapper}>
        <SkeletonBlock width={178} height={42} child />
        <SkeletonBlock width={178} height={42} child />
      </View>
    </ThemedView>
  );
}

function AchievementsCardSkeleton() {
  return (
    <View style={styles.rewardWrapper}>
      {Array.from({ length: 2 }).map((_, index) => (
        <ThemedView child style={styles.achievementCard} key={index}>
          <SkeletonBlock width={40} height={40} radius="round" child />
          <SkeletonBlock width={86} height={14} child />
          <SkeletonBlock width={58} height={20} child />
        </ThemedView>
      ))}
    </View>
  );
}
