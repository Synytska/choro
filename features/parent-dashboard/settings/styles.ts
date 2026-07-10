import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Common
  contentWrapper: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  sectionWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
  // ParentInformation
  customText: {
    fontSize: 32,
  },
  input: {
    borderBottomWidth: 1,
    borderWidth: 0,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  changePassContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changePassWrapper: {
    flexDirection: "row",
    gap: 6,
  },
});
