import React from "react";
import { NavLink } from "react-router-dom";
import PhoneAuth from "../components/auth/PhoneAuth";

// PhoneAuth itself was real, working code (Redux phoneNumber/verificationId
// state, actual signInWithPhoneNumber/signInWithCredential calls) that was
// never routed or rendered anywhere -- this page is its only entry point.
const PhoneLogin: React.FC = () => (
  <main className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center gap-4">
      <PhoneAuth />
      <p className="text-sm text-center text-gray-600">
        Prefer email?{" "}
        <NavLink to="/login" className="text-blue-600 hover:underline">
          Sign in with email
        </NavLink>
      </p>
    </div>
  </main>
);

export default PhoneLogin;
