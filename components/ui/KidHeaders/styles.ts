import { StyleSheet } from "react-native";

import { paddingHorizontal } from "@/lib/constants";

export const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 2,
    gap: 12,
    paddingHorizontal: paddingHorizontal,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: 800,
  },
  greeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
  },
  playerMeta: {
    gap: 6,
  },
  playerName: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 30,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
