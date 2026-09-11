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

type PetGrownCelebration = {
  childId: string;
  nextLevel: number;
  nextStage: string;
  previousStage: string;
  eventId: number;
};

type CelebrationState = {
  coinGain: CoinGainCelebration | null;
  current: LevelUpCelebration | null;
  petGrown: PetGrownCelebration | null;
};

const initialState: CelebrationState = {
  coinGain: null,
  current: null,
  petGrown: null,
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
    hidePetGrown: (state) => {
      state.petGrown = null;
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
    showPetGrown: (
      state,
      action: PayloadAction<{
        childId: string;
        nextLevel: number;
        nextStage: string;
        previousStage: string;
      }>,
    ) => {
      state.petGrown = {
        childId: action.payload.childId,
        nextLevel: action.payload.nextLevel,
        nextStage: action.payload.nextStage,
        previousStage: action.payload.previousStage,
        eventId: Date.now(),
      };
    },
  },
});

export const {
  hideCelebration,
  hideCoinGain,
  hidePetGrown,
  showCoinGain,
  showLevelUp,
  showPetGrown,
} = celebrationSlice.actions;

export const celebrationReducer = celebrationSlice.reducer;
