import { RootState } from "@/store";

export const selectCurrentCelebration = (state: RootState) => state.celebration.current;
export const selectCoinGainCelebration = (state: RootState) => state.celebration.coinGain;
export const selectPetGrownCelebration = (state: RootState) => state.celebration.petGrown;
