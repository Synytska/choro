import { describe, expect, it } from "@jest/globals";

import { authReducer, logout, setCredentials, setSelectedRole, updateUser } from "../authSlice";
import {
  selectAccessToken,
  selectAuthUserEmail,
  selectIsAuthenticated,
  selectSelectedRole,
} from "../selectors";

describe("auth slice", () => {
  it("stores credentials and exposes them through selectors", () => {
    const state = authReducer(
      undefined,
      setCredentials({
        accessToken: "access-token",
        user: {
          id: "kid-1",
          email: "kid@test.com",
          name: "Kid",
          role: "kid",
        },
      }),
    );
    const rootState = { auth: state } as Parameters<typeof selectIsAuthenticated>[0];

    expect(selectIsAuthenticated(rootState)).toBe(true);
    expect(selectSelectedRole(rootState)).toBe("kid");
    expect(selectAccessToken(rootState)).toBe("access-token");
    expect(selectAuthUserEmail(rootState)).toBe("kid@test.com");
  });

  it("updates selected role and existing user fields", () => {
    let state = authReducer(undefined, setSelectedRole("kid"));
    state = authReducer(state, updateUser({ name: "Updated Parent" }));
    const rootState = { auth: state } as Parameters<typeof selectIsAuthenticated>[0];

    expect(selectSelectedRole(rootState)).toBe("kid");
    expect(rootState.auth.user?.name).toBe("Updated Parent");
  });

  it("clears session data on logout", () => {
    const state = authReducer(undefined, logout());
    const rootState = { auth: state } as Parameters<typeof selectIsAuthenticated>[0];

    expect(selectIsAuthenticated(rootState)).toBe(false);
    expect(selectAccessToken(rootState)).toBeNull();
    expect(rootState.auth.user).toBeNull();
  });
});
