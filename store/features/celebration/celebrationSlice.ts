import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LevelUpCelebration = {
  type: "levelUp";
  childId: string;
  previousLevel: number;
  nextLevel: number;
};

type CoinGainCelebration = {
  childId: string;
  amount: number;
};

type CelebrationState = {
  coinGain: CoinGainCelebration | null;
  current: LevelUpCelebration | null;
};

const initialState: CelebrationState = {
  coinGain: null,
  current: null,
};

const celebrationSlice = createSlice({
  name: "celebration",
  initialState,
  reducers: {
    hideCelebration: (state) => {
      state.current = null;
    },
    hideCoinGain: (state) => {
      state.coinGain = null;
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
    showCoinGain: (state, action: PayloadAction<{ childId: string; amount: number }>) => {
      state.coinGain = {
        childId: action.payload.childId,
        amount: action.payload.amount,
      };
    },
  },
});

export const { hideCelebration, hideCoinGain, showCoinGain, showLevelUp } =
  celebrationSlice.actions;

export const celebrationReducer = celebrationSlice.reducer;
