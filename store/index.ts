import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./features/auth/authSlice";
import { celebrationReducer } from "./features/celebration/celebrationSlice";
import { onboardingReducer } from "./features/onboarding/onboardingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    celebration: celebrationReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
