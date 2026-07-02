import { StyleSheet } from "react-native";

import { ParentDashboardTasksUI } from "@/features/parent-dashboard/tasks";

export default function ParentTasks() {
  return <ParentDashboardTasksUI />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
