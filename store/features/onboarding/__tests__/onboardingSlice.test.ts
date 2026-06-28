import { describe, expect, it } from "@jest/globals";

import {
  onboardingReducer,
  setChildAge,
  setChildGender,
  setChildName,
  setPrize,
  toggleTask,
  updateOnboarding,
} from "../onboardingSlice";
import {
  selectChildAge,
  selectChildGender,
  selectChildName,
  selectHasSelectedTasks,
  selectPrize,
  selectSelectedTaskIds,
} from "../selectors";

describe("onboarding slice", () => {
  it("stores child profile fields", () => {
    let state = onboardingReducer(undefined, setChildName("Mia"));
    state = onboardingReducer(state, setChildAge(8));
    state = onboardingReducer(state, setChildGender("girl"));
    const rootState = { onboarding: state } as Parameters<typeof selectChildName>[0];

    expect(selectChildName(rootState)).toBe("Mia");
    expect(selectChildAge(rootState)).toBe(8);
    expect(selectChildGender(rootState)).toBe("girl");
  });

  it("toggles tasks and derives selected task ids", () => {
    const initialState = onboardingReducer(undefined, { type: "init" });
    const firstTaskId = initialState.tasks[0].id;
    const state = onboardingReducer(initialState, toggleTask(firstTaskId));
    const rootState = { onboarding: state } as Parameters<typeof selectSelectedTaskIds>[0];

    expect(selectHasSelectedTasks(rootState)).toBe(true);
    expect(selectSelectedTaskIds(rootState)).toEqual([firstTaskId]);
  });

  it("updates prize and supports partial onboarding updates", () => {
    let state = onboardingReducer(
      undefined,
      setPrize({
        name: "Bike",
        coinAmount: "120",
        imageUri: "file://bike.png",
      }),
    );
    state = onboardingReducer(
      state,
      updateOnboarding({
        childCode: "ABC123",
        childName: "Alex",
      }),
    );
    const rootState = { onboarding: state } as Parameters<typeof selectPrize>[0];

    expect(selectPrize(rootState)).toEqual({
      name: "Bike",
      coinAmount: "120",
      imageUri: "file://bike.png",
    });
    expect(rootState.onboarding.childCode).toBe("ABC123");
    expect(rootState.onboarding.childName).toBe("Alex");
  });
});
