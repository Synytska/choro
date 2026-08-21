import { RootState } from "@/store";

export const selectCurrentCelebration = (state: RootState) => state.celebration.current;
