import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthRole = "parent" | "kid";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
};

type AuthState = {
  isAuthenticated: boolean;
  selectedRole: AuthRole;
  accessToken: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isAuthenticated: true,
  selectedRole: "parent",
  accessToken: "test-access-token",
  user: {
    id: "test-parent-1",
    name: "Test Parent",
    email: "parent@test.choro",
    role: "parent",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<AuthRole>) => {
      state.selectedRole = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.selectedRole = action.payload.user.role;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) {
        return;
      }

      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { logout, setCredentials, setSelectedRole, updateUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
