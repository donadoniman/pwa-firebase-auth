import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  // True until Firebase's persisted session has actually been read (its
  // default browserLocalPersistence lookup is async, even for an
  // already-signed-in user) -- a consumer that treats `loading === false`
  // and `isAuthenticated === false` as "definitely signed out" avoids the
  // classic hydration bug of flashing a logged-out UI (Home.tsx's own
  // "You are successfully logged in" copy used to render unconditionally,
  // regardless of whether anyone was actually signed in) before the real
  // session has had a chance to resolve.
  loading: boolean;
  logout: () => Promise<void>;
}

// Defining the children prop type
interface AuthProviderProps {
  children: ReactNode; // children can be any valid React child
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Was a local `isAuthenticated` boolean with a fake login() setter --
  // never actually talked to Firebase, so every reload started
  // signed-out regardless of a real persisted session, and this provider
  // was never even mounted anywhere in the app. onAuthStateChanged is
  // the actual hydration source: it fires once immediately with whatever
  // session Firebase already has persisted (or null), then again on
  // every real sign-in/sign-out (email+password, Google, phone OTP --
  // all of them funnel through the same `auth` instance).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
