import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

// A layout route (rendered as the parent element of nested <Route>s, per
// AppRoutes.tsx's own sketch) rather than a children-wrapping component --
// lets any number of protected routes nest under one <Route element={<PrivateRoute />}>
// without each needing its own guard.
//
// Waiting on `loading` before deciding is the actual hydration fix: without
// it, this would render <Navigate to="/login" /> for a split second on
// every reload -- even for an already-signed-in user -- purely because
// Firebase's persisted session hadn't been read back yet.
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute;
