import React, { useState } from "react";
import { ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "../services/firebaseService";

const { loginWithEmail, setupRecaptcha, loginWithPhone } = firebaseAuth;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear error state before starting the login process
    try {
      const user = await loginWithEmail(email, password);
      console.log("Logged in successfully:", user);
      alert("Login successful!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error(err);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear error state before starting the phone login process
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const result = await loginWithPhone(phone, recaptchaVerifier);
      setConfirmationResult(result);
      alert("Verification code sent to your phone!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error(err);
    }
  };

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear error state before verifying the code
    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result available.");
      }
      const user = await confirmationResult.confirm(verificationCode);
      console.log("Phone login successful:", user);
      alert("Login successful!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isPhoneLogin ? (
        <form onSubmit={confirmationResult ? verifyCode : handlePhoneLogin}>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
              disabled={!!confirmationResult}
            />
          </div>
          {confirmationResult && (
            <div>
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code"
                required
              />
            </div>
          )}
          <div id="recaptcha-container"></div>
          <button type="submit">
            {confirmationResult ? "Verify Code" : "Send Code"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPhoneLogin(false);
              setError("");
            }}
          >
            Use Email Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmailLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
          <button
            type="button"
            onClick={() => {
              setIsPhoneLogin(true);
              setError("");
            }}
          >
            Use Phone Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;