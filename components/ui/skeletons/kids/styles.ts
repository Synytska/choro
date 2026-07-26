import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gap10: {
    gap: 10,
  },
  gap4: {
    gap: 4,
  },
  gap16: {
    gap: 16,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerWrapper: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  xpCard: {
    zIndex: 100,
    padding: 16,
    gap: 12,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardWrapper: {
    gap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceCard: {
    zIndex: 100,
    padding: 16,
    gap: 20,
  },
  achievementCard: {
    width: 194,
    height: 118,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  tasksWrapper: {
    gap: 6,
    alignItems: "flex-start",
  },
  progressCard: {
    zIndex: 100,
    padding: 16,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});
