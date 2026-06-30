import { StyleSheet } from "react-native";

export const parentStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
    elevation: 2,
  },
});
