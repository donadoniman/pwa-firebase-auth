import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "../../services/firebaseService";
const { setupRecaptcha, loginWithPhone } = firebaseAuth;

const PhoneAuth: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  useEffect(() => {
    if (success) {
      navigate("/dashboard"); // Redirect to the dashboard
    }
  }, [success, navigate]);

  // Effect for handling login success or error
  useEffect(() => {
    if (success) {
      console.log("User logged in successfully!");
      // Perform actions on success (e.g., redirect, update store, etc.)
    }

    if (error) {
      console.error("Error encountered:", error);
      // Perform actions on error (e.g., show notification)
    }
  }, [success, error]);

  const handlePhoneLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear error state before starting the phone login process
    setSuccess(false); // Reset success state
    setLoading(true); // Start loading
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const result = await loginWithPhone(phone, recaptchaVerifier);
      setConfirmationResult(result);
      setError("Verification code sent to your phone!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const verifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear error state before verifying the code
    setSuccess(false); // Reset success state
    setLoading(true); // Start loading
    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result available.");
      }
      const user = await confirmationResult.confirm(verificationCode);
      console.log("Phone login successful:", user);
      setSuccess(true); // Set success state on successful verification
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Login successful!</p>}

      <form
        onSubmit={confirmationResult ? verifyCode : handlePhoneLogin}
        className="mt-8 space-y-6"
      >
        <div>
          <label
            htmlFor="phone-number"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!confirmationResult || loading}
          />
        </div>
        {confirmationResult && (
          <div>
            <label
              htmlFor="verification-code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code:
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter code"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading} // Disable input when loading
            />
          </div>
        )}
        <div id="recaptcha-container"></div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } rounded-md`}
          disabled={loading} // Disable button when loading
        >
          {loading
            ? "Processing..."
            : confirmationResult
            ? "Verify Code"
            : "Send Code"}
        </button>
      </form>
    </>
  );
};

export default PhoneAuth;
