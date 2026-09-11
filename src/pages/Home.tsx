import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

// Was calling onAuthStateChanged directly in a useEffect with no
// unsubscribe (a listener leaked on every mount) and only logged the
// result to the console -- the actual copy below unconditionally said
// "You are successfully logged in" for every visitor, signed in or not.
// useAuth() gives the same real, hydrated session (one listener, shared
// app-wide via AuthProvider) and lets the copy reflect it.
const Home = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return null;

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to FocusApp</h1>
        {isAuthenticated ? (
          <>
            <p className="mt-4 text-lg text-gray-600">
              You are successfully logged in{user?.email ? ` as ${user.email}` : ""}. Explore the app and get
              productive!
            </p>
            <button
              className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={() => console.log("Start Exploring")}
            >
              Start Exploring
            </button>
          </>
        ) : (
          <p className="mt-4 text-lg text-gray-600">
            <NavLink to="/login" className="text-blue-600 hover:underline">
              Sign in
            </NavLink>{" "}
            to get started.
          </p>
        )}
      </div>
    </section>
  );
};

export default Home;
