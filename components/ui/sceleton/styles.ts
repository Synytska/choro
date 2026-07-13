import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  headerAction: {
    marginLeft: "auto",
  },

  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childrenGrid: {
    flexDirection: "row",
    gap: 12,
  },
  childCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardCopy: {
    flex: 1,
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 6,
  },
  statItem: {
    flex: 1,
    minHeight: 78,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  taskLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  list: {
    gap: 12,
  },
  childDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsHeroCard: {
    minHeight: 180,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  progressCard: {
    borderRadius: 12,
    padding: 20,
    gap: 18,
  },
  centeredBlock: {
    alignSelf: "center",
  },
  tabsSkeleton: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 24,
  },
});
