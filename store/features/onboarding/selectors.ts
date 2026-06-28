import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectCurrentStep = (state: RootState) => state.onboarding.currentStep;
export const selectTotalSteps = (state: RootState) => state.onboarding.totalSteps;
export const selectChildName = (state: RootState) => state.onboarding.childName;
export const selectChildAge = (state: RootState) => state.onboarding.childAge;
export const selectChildGender = (state: RootState) => state.onboarding.childGender;
export const selectChildCode = (state: RootState) => state.onboarding.childCode;
export const selectOnboardingTasks = (state: RootState) => state.onboarding.tasks;
export const selectPrize = (state: RootState) => state.onboarding.prize;
export const selectPrizeName = (state: RootState) => state.onboarding.prize.name;
export const selectPrizeCoinAmount = (state: RootState) => state.onboarding.prize.coinAmount;
export const selectPrizeImageUri = (state: RootState) => state.onboarding.prize.imageUri;

export const selectSelectedTasks = createSelector([selectOnboardingTasks], (tasks) =>
  tasks.filter((task) => task.selected),
);

export const selectSelectedTaskIds = createSelector([selectSelectedTasks], (tasks) =>
  tasks.map((task) => task.id),
);

export const selectOnboardingProgress = createSelector(
  [selectCurrentStep, selectTotalSteps],
  (currentStep, totalSteps) => ({ currentStep, totalSteps }),
);

export const selectHasSelectedTasks = createSelector(
  [selectSelectedTasks],
  (tasks) => tasks.length > 0,
);
