import { StyleSheet, View } from "react-native";

import { SkeletonBlock } from "./SkeletonBlock";

export function ModalSkeleton() {
  return (
    <View testID="modal-skeleton" style={styles.screen}>
      <View style={styles.headerWrapper}>
        <SkeletonBlock width={150} height={22} />
        <SkeletonBlock width={260} height={20} />
      </View>

      <View style={styles.blockWrapper}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.inputWrapper}>
            <SkeletonBlock width={50} height={10} />
            <SkeletonBlock width="100%" height={52} />
          </View>
        ))}
      </View>

      <View style={styles.blockWrapper}>
        <SkeletonBlock width={50} height={10} />
        <View style={styles.genderWrapper}>
          {Array.from({ length: 2 }).map((_, index) => (
            <View key={index} style={styles.radioWrapper}>
              <SkeletonBlock width={23} height={10} />
              <SkeletonBlock width={26} height={26} radius="round" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.blockWrapper}>
        <SkeletonBlock width={50} height={10} />
        <View style={styles.iconsWrapper}>
          {Array.from({ length: 7 }).map((_, index) => (
            <SkeletonBlock key={index} width={50} height={50} radius="round" />
          ))}
        </View>
      </View>

      <View style={styles.separator}>
        <SkeletonBlock width={160} height={2} />
        <SkeletonBlock width={26} height={26} />
        <SkeletonBlock width={160} height={2} />
      </View>

      <View>
        <SkeletonBlock width={100} height={100} radius="round" />
      </View>

      <View style={styles.buttons}>
        <SkeletonBlock width="100%" height={56} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 32,
    alignItems: "center",
    flex: 1,
    paddingBottom: 40,
  },
  headerWrapper: {
    gap: 10,
    alignItems: "center",
  },
  blockWrapper: {
    alignItems: "flex-start",
    width: "100%",
    gap: 20,
  },
  inputWrapper: {
    gap: 6,
  },
  genderWrapper: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  radioWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconsWrapper: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  separator: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  buttons: {
    gap: 10,
    justifyContent: "flex-end",
    flex: 1,
  },
});
