import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
    elevation: 2,
  },
  kidShadow: {
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});
