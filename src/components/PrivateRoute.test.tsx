import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "./PrivateRoute";

const mockUseAuth = jest.fn();
jest.mock("../providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("PrivateRoute", () => {
  it("renders nothing while auth is still hydrating -- no premature redirect", () => {
    // The concrete hydration bug this guards against: without checking
    // `loading`, this would redirect an already-signed-in user to /login
    // for a split second on every reload, purely because Firebase's
    // persisted session hadn't been read back yet.
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: true });
    renderAt("/dashboard");
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login page")).not.toBeInTheDocument();
  });

  it("redirects to /login once hydrated and signed out", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });
    renderAt("/dashboard");
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders the nested route once hydrated and signed in", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });
    renderAt("/dashboard");
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });
});
