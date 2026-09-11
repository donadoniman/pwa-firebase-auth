import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

// Reachable only via PrivateRoute -- rendering `user`'s own fields here
// doubles as a manual check that hydration produced a real session, not
// just a truthy placeholder.
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Signed in as {user?.email ?? user?.displayName ?? user?.uid}.
        </p>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="mt-6 w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Log out
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
