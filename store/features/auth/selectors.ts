import type { RootState } from "@/store";

export const selectAuthUserId = (state: RootState) => state.auth.user?.id;
export const selectAuthUserLoginCode = (state: RootState) => state.auth.user?.loginCode;
