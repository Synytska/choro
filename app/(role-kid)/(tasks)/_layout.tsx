import { Stack } from "expo-router";

import { TasksScreenHeader } from "@/components/ui/KidHeaders/TasksScreenHeader";

export default function ChildrenTasksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <TasksScreenHeader />,
        }}
      />
    </Stack>
  );
}
