import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthScreen from "../pages/AuthScreen";
import ProfileScreen from "../pages/ProfileScreen";

const AppRoutes = ({ isAuthenticated, setIsAuthenticated, profileInfo, setProfileInfo }) => {
  return (
    <Routes>
      {/* Public Route: AuthScreen */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to="/profile" replace />
          ) : (
            <AuthScreen setIsAuthenticated={setIsAuthenticated} setProfileInfo={setProfileInfo} />
          )
        }
      />
      {/* Protected Route: ProfileScreen */}
      <Route
        path="/profile"
        element={
          isAuthenticated ? <ProfileScreen profileInfo={profileInfo} setProfileInfo={setProfileInfo} /> : <Navigate to="/auth" replace />
        }
      />
      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/profile" : "/auth"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
