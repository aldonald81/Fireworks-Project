import React from "react";
import "./AuthScreen.css";
import AuthModal from "../../containers/AuthModal";

const AuthScreen = ({ setIsAuthenticated, setProfileInfo }) => {
  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-brand">Vericade</div>
      <AuthModal setIsAuthenticated={setIsAuthenticated} setProfileInfo={setProfileInfo} />
    </div>
  );
};

export default AuthScreen;
