import React, { useState } from "react";
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
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const dispatch = useDispatch();
  const { phoneNumber, verificationId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSendOtp = async (phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      dispatch(setVerificationId(confirmationResult.verificationId));
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (verificationId) {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      try {
        await signInWithCredential(auth, credential);
        dispatch(setAuthenticated(true));
      } catch (error) {
        console.error("Error verifying OTP", error);
      }
    }
  };

  return (
    <div>
      {!isOtpSent ? (
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
          />
          <button onClick={() => handleSendOtp(phoneNumber)}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={() => handleVerifyOtp(otp)}>Verify OTP</button>
        </div>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuth;
