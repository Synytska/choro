import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LevelUpCelebration = {
  type: "levelUp";
  childId: string;
  previousLevel: number;
  nextLevel: number;
};

type CelebrationState = {
  current: LevelUpCelebration | null;
};

const initialState: CelebrationState = {
  current: null,
};

const celebrationSlice = createSlice({
  name: "celebration",
  initialState,
  reducers: {
    hideCelebration: (state) => {
      state.current = null;
    },
    showLevelUp: (
      state,
      action: PayloadAction<{ childId: string; previousLevel: number; nextLevel: number }>,
    ) => {
      state.current = {
        type: "levelUp",
        childId: action.payload.childId,
        previousLevel: action.payload.previousLevel,
        nextLevel: action.payload.nextLevel,
      };
    },
  },
});

export const { hideCelebration, showLevelUp } = celebrationSlice.actions;

export const celebrationReducer = celebrationSlice.reducer;
