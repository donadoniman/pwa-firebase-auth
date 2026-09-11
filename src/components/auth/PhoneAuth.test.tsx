import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/authSlice";
import PhoneAuth from "./PhoneAuth";

const mockRecaptchaVerifier = jest.fn();
const mockSignInWithPhoneNumber = jest.fn();
const mockSignInWithCredential = jest.fn();
const mockCredential = jest.fn((...args: unknown[]) => "mock-credential");
jest.mock("firebase/auth", () => ({
  RecaptchaVerifier: function RecaptchaVerifier(...args: unknown[]) {
    mockRecaptchaVerifier(...args);
  },
  signInWithPhoneNumber: (...args: unknown[]) => mockSignInWithPhoneNumber(...args),
  PhoneAuthProvider: { credential: (...args: unknown[]) => mockCredential(...args) },
  signInWithCredential: (...args: unknown[]) => mockSignInWithCredential(...args),
}));
jest.mock("../../services/firebase", () => ({ auth: {} }));

function renderPhoneAuth() {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PhoneAuth />
      </MemoryRouter>
    </Provider>
  );
}

beforeEach(() => {
  mockRecaptchaVerifier.mockClear();
  mockSignInWithPhoneNumber.mockClear();
  mockSignInWithCredential.mockClear();
});

describe("PhoneAuth", () => {
  it("sends an OTP and reveals the code input", async () => {
    mockSignInWithPhoneNumber.mockResolvedValueOnce({ verificationId: "verify-123" });
    const user = userEvent.setup();
    renderPhoneAuth();

    await user.type(screen.getByLabelText(/phone number/i), "+61400000000");
    await user.click(screen.getByRole("button", { name: /send code/i }));

    expect(await screen.findByLabelText(/enter the code/i)).toBeInTheDocument();
    expect(mockSignInWithPhoneNumber).toHaveBeenCalledWith({}, "+61400000000", expect.anything());
    // Only one RecaptchaVerifier instance for the whole flow.
    expect(mockRecaptchaVerifier).toHaveBeenCalledTimes(1);
  });

  it("does not create a second RecaptchaVerifier if OTP send is retried", async () => {
    mockSignInWithPhoneNumber.mockRejectedValueOnce(new Error("network error"));
    mockSignInWithPhoneNumber.mockResolvedValueOnce({ verificationId: "verify-123" });
    const user = userEvent.setup();
    renderPhoneAuth();

    await user.type(screen.getByLabelText(/phone number/i), "+61400000000");
    await user.click(screen.getByRole("button", { name: /send code/i }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /send code/i }));
    await waitFor(() => expect(mockSignInWithPhoneNumber).toHaveBeenCalledTimes(2));
    expect(mockRecaptchaVerifier).toHaveBeenCalledTimes(1);
  });

  it("verifies the OTP and surfaces an error if it's rejected", async () => {
    mockSignInWithPhoneNumber.mockResolvedValueOnce({ verificationId: "verify-123" });
    mockSignInWithCredential.mockRejectedValueOnce(new Error("invalid-code"));
    const user = userEvent.setup();
    renderPhoneAuth();

    await user.type(screen.getByLabelText(/phone number/i), "+61400000000");
    await user.click(screen.getByRole("button", { name: /send code/i }));
    await screen.findByLabelText(/enter the code/i);

    await user.type(screen.getByLabelText(/enter the code/i), "000000");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("invalid-code");
  });
});
