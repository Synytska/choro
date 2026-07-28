import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthRole = "parent" | "kid";

type AuthUser = {
  id: string;
  name: string;
  email?: string | null;
  role: AuthRole;
  avatarId?: string | null;
  avatarUrl?: string | null;
  loginCode?: string | null;
};

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;

export const authReducer = authSlice.reducer;
