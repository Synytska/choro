import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectChildName = (state: RootState) => state.onboarding.childName;
export const selectChildCode = (state: RootState) => state.onboarding.childCode;
export const selectOnboardingTasks = (state: RootState) => state.onboarding.tasks;

const selectSelectedTasks = createSelector([selectOnboardingTasks], (tasks) =>
  tasks.filter((task) => task.selected),
);

export const selectHasSelectedTasks = createSelector(
  [selectSelectedTasks],
  (tasks) => tasks.length > 0,
);
