import { StyleSheet } from "react-native";

import { Palette } from "@/constants/theme";
import { paddingHorizontal } from "@/lib/constants";

export const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 2,
    gap: 12,
    paddingHorizontal: paddingHorizontal,
    paddingBottom: 16,
    backgroundColor: Palette.darkNavy,
    borderColor: Palette.borderBlue,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: 800,
    color: Palette.darkGrey,
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
    textTransform: "uppercase",
    color: Palette.white,
  },
  avatar: {
    width: 50,
    height: 50,
    shadowColor: Palette.green,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
