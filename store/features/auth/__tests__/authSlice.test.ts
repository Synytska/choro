import { describe, expect, it } from "@jest/globals";

import { authReducer, logout, setCredentials } from "../authSlice";
import { selectAuthUserId, selectAuthUserLoginCode } from "../selectors";

describe("auth slice", () => {
  it("stores kid credentials and exposes them through selectors", () => {
    const state = authReducer(
      undefined,
      setCredentials({
        user: {
          id: "kid-1",
          loginCode: "123456",
          name: "Kid",
          role: "kid",
        },
      }),
    );
    const rootState = { auth: state } as Parameters<typeof selectAuthUserId>[0];

    expect(selectAuthUserId(rootState)).toBe("kid-1");
    expect(selectAuthUserLoginCode(rootState)).toBe("123456");
  });

  it("clears session data on logout", () => {
    const state = authReducer(undefined, logout());

    expect(state.user).toBeNull();
  });
});
