vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ replace: vi.fn() }),
  };
});

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthContext", () => {
  it("signIn stores token and isAuthenticated", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signIn("dummy-token", false);
    });

    expect(result.current.token).toBe("dummy-token");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("signOut clears token and unauthenticates", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signIn("dummy-token", false);
    });
    act(() => {
      result.current.signOut();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
}); 