import type { RootState } from "@/store";

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectSelectedRole = (state: RootState) => state.auth.selectedRole;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthUserId = (state: RootState) => state.auth.user?.id;
export const selectAuthUserEmail = (state: RootState) => state.auth.user?.email;
export const selectAuthUserName = (state: RootState) => state.auth.user?.name;
