import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const Home = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in, UID:", uid);
      } else {
        console.log("User is logged out");
      }
    });
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to FocusApp</h1>
        <p className="mt-4 text-lg text-gray-600">
          You are successfully logged in. Explore the app and get productive!
        </p>
        <button
          className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          onClick={() => console.log("Start Exploring")}
        >
          Start Exploring
        </button>
      </div>
    </section>
  );
};

export default Home;