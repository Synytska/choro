import { describe, expect, it } from "@jest/globals";

import { onboardingReducer, setPrize, toggleTask, updateOnboarding } from "../onboardingSlice";
import { selectChildName, selectHasSelectedTasks } from "../selectors";

describe("onboarding slice", () => {
  it("stores child profile fields", () => {
    const state = onboardingReducer(
      undefined,
      updateOnboarding({
        childAge: 8,
        childGender: "girl",
        childName: "Mia",
      }),
    );
    const rootState = { onboarding: state } as Parameters<typeof selectChildName>[0];

    expect(selectChildName(rootState)).toBe("Mia");
    expect(rootState.onboarding.childAge).toBe(8);
    expect(rootState.onboarding.childGender).toBe("girl");
  });

  it("toggles tasks and derives selected task ids", () => {
    const initialState = onboardingReducer(undefined, { type: "init" });
    const firstTaskId = initialState.tasks[0].id;
    const state = onboardingReducer(initialState, toggleTask(firstTaskId));
    const rootState = { onboarding: state } as Parameters<typeof selectHasSelectedTasks>[0];

    expect(selectHasSelectedTasks(rootState)).toBe(true);
    expect(
      rootState.onboarding.tasks.filter((task) => task.selected).map((task) => task.id),
    ).toEqual([firstTaskId]);
  });

  it("updates prize and supports partial onboarding updates", () => {
    let state = onboardingReducer(
      undefined,
      setPrize({
        name: "Bike",
        coinAmount: "120",
        icon: "🚲",
        imageUri: "file://bike.png",
        imageMimeType: "image/png",
      }),
    );
    state = onboardingReducer(
      state,
      updateOnboarding({
        childCode: "ABC123",
        childName: "Alex",
      }),
    );
    const rootState = { onboarding: state };

    expect(rootState.onboarding.prize).toEqual({
      name: "Bike",
      coinAmount: "120",
      icon: "🚲",
      imageUri: "file://bike.png",
      imageMimeType: "image/png",
    });
    expect(rootState.onboarding.childCode).toBe("ABC123");
    expect(rootState.onboarding.childName).toBe("Alex");
  });
});
