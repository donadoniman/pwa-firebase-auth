import React from "react";
import { NavLink } from "react-router-dom";

const NotFound: React.FC = () => (
  <section className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-lg text-gray-600">That page doesn't exist.</p>
      <NavLink to="/" className="mt-6 inline-block text-blue-600 hover:underline">
        Back to home
      </NavLink>
    </div>
  </section>
);

export default NotFound;
