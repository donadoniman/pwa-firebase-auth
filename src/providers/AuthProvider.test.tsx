import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";

// Real onAuthStateChanged talks to a live Firebase project (and needs
// real REACT_APP_* config) -- not what's under test here, which is
// AuthProvider's own hydration state machine. The mock lets each test
// control exactly when/what the "persisted session" callback fires.
let authStateCallback: ((user: unknown) => void) | null = null;
const mockSignOut = jest.fn();
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: unknown) => void) => {
    authStateCallback = callback;
    return jest.fn(); // unsubscribe
  },
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));
jest.mock("../services/firebase", () => ({ auth: {} }));

import { AuthProvider, useAuth } from "./AuthProvider";

function Probe() {
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? (user as { uid: string }).uid : "none"}</span>
    </div>
  );
}

beforeEach(() => {
  authStateCallback = null;
  mockSignOut.mockClear();
});

describe("AuthProvider hydration", () => {
  it("starts in a loading state before Firebase's persisted session resolves", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    // Real bug this guards against: treating "not yet loading === false"
    // as "signed out" before onAuthStateChanged's first callback fires.
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("hydrates isAuthenticated + user once onAuthStateChanged reports an existing session", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    expect(authStateCallback).not.toBeNull();
    act(() => {
      authStateCallback!({ uid: "user-123" });
    });

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("user-123");
  });

  it("resolves to signed-out (not stuck loading) when there is no persisted session", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );
    act(() => {
      authStateCallback!(null);
    });

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("logout() delegates to Firebase signOut", async () => {
    function LogoutProbe() {
      const { logout } = useAuth();
      return (
        <button type="button" onClick={() => void logout()}>
          Log out
        </button>
      );
    }
    render(
      <AuthProvider>
        <LogoutProbe />
      </AuthProvider>
    );
    act(() => {
      authStateCallback!({ uid: "user-123" });
    });
    await waitFor(() => expect(mockSignOut).not.toHaveBeenCalled());

    screen.getByRole("button", { name: "Log out" }).click();
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
  });

  it("useAuth throws outside of an AuthProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow("useAuth must be used within an AuthProvider");
    consoleError.mockRestore();
  });
});
