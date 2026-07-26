import { View } from "react-native";

import { ThemedView } from "@/components/themed-view";

import { SkeletonBlock } from "../SkeletonBlock";
import { styles } from "./styles";
import { TasksSkeleton } from "./TasksSkeleton";

export function ChildHeaderSkeleton() {
  return (
    <View style={styles.gap10}>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <SkeletonBlock width={44} height={44} radius="round" child />
          <View style={styles.gap4}>
            <SkeletonBlock width={130} height={23} child />
            <SkeletonBlock width={100} height={28} radius="round" child />
          </View>
        </View>
        <SkeletonBlock width={44} height={44} radius="round" child />
      </View>
      <SkeletonBlock width={400} height={16} child />
    </View>
  );
}

export function ChildHomeScreenSkeleton() {
  return (
    <View style={styles.gap16}>
      <XPCardSkeleton />
      <ActiveQuestsSkeleton />
      <TasksSkeleton />
      <CoinStashSkeleton />
    </View>
  );
}

function XPCardSkeleton() {
  return (
    <ThemedView child style={styles.xpCard}>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <SkeletonBlock width={32} height={32} child />
          <SkeletonBlock width={117} height={19} child />
        </View>
        <SkeletonBlock width={100} height={28} radius="round" child />
      </View>
      <SkeletonBlock width={"100%"} height={16} child />
      <View style={styles.wrapper}>
        <SkeletonBlock width={87} height={16} child />
        <SkeletonBlock width={44} height={16} child />
      </View>
    </ThemedView>
  );
}

function ActiveQuestsSkeleton() {
  return (
    <View style={styles.gap16}>
      <View style={styles.wrapper}>
        <SkeletonBlock width={141} height={30} child />
        <SkeletonBlock width={60} height={30} child />
      </View>
      <SkeletonBlock width="100%" height={50} child />
    </View>
  );
}

function CoinStashSkeleton() {
  return (
    <ThemedView child style={styles.xpCard}>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <SkeletonBlock width={32} height={32} child />
          <SkeletonBlock width={96} height={21} child />
        </View>
        <SkeletonBlock width={60} height={32} child />
      </View>

      <View style={styles.wrapper}>
        <SkeletonBlock width={170} height={74} child />
        <SkeletonBlock width={170} height={74} child />
      </View>
    </ThemedView>
  );
}
