import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { auth } from "../../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import {
  setPhoneNumber,
  setVerificationId,
  setAuthenticated,
} from "../../features/authSlice";

const PhoneAuth: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const dispatch = useDispatch();
  const { phoneNumber, verificationId } = useSelector(
    (state: RootState) => state.auth
  );
  // Was created fresh on every handleSendOtp call, with no cleanup -- a
  // retry (wrong number, "resend") attached a second invisible reCAPTCHA
  // widget to the same #recaptcha-container without clearing the first,
  // which Firebase itself warns against ("reCAPTCHA has already been
  // rendered in this element"). One instance, created lazily and reused.
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const handleSendOtp = async (phoneNumberValue: string) => {
    setError(null);
    setSending(true);
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumberValue,
        recaptchaVerifierRef.current
      );
      dispatch(setVerificationId(confirmationResult.verificationId));
      setIsOtpSent(true);
    } catch (err) {
      console.error("Error sending OTP", err);
      setError(err instanceof Error ? err.message : "Couldn't send that code. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    if (!verificationId) return;
    setError(null);
    setVerifying(true);
    const credential = PhoneAuthProvider.credential(verificationId, otpValue);
    try {
      await signInWithCredential(auth, credential);
      dispatch(setAuthenticated(true));
      // signInWithCredential already updated the real Firebase session --
      // AuthProvider's own onAuthStateChanged listener (the actual source
      // of truth PrivateRoute gates on) picks that up on its own. Without
      // this navigate, verifying successfully just left the OTP screen on
      // screen with no visible feedback that anything happened.
      navigate("/");
    } catch (err) {
      console.error("Error verifying OTP", err);
      setError(err instanceof Error ? err.message : "That code didn't match. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800">FocusApp</h1>

      {!isOtpSent ? (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              id="phone-number"
              type="tel"
              placeholder="+61 4xx xxx xxx"
              value={phoneNumber}
              onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            disabled={sending || !phoneNumber}
            onClick={() => handleSendOtp(phoneNumber)}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
          >
            {sending ? "Sending…" : "Send code"}
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter the code we sent you
            </label>
            <input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            disabled={verifying || !otp}
            onClick={() => handleVerifyOtp(otp)}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
          >
            {verifying ? "Verifying…" : "Verify code"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
