import React, { useState } from "react";
import UploadDocumentImage from "../../components/UploadDocumentImage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Checkmark } from "react-checkmark";
import { IoMdCloseCircleOutline } from "react-icons/io";

import "./AuthModal.css";

const AuthModal = ({ setIsAuthenticated, setProfileInfo }) => {
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [authState, setAuthState] = useState("upload");

  return (
    <div className="card">
      <h1 className="card-title">
        {authState === "upload"
          ? "Welcome!"
          : authState === "success"
          ? "Success!"
          : authState === "failure"
          ? "Auth Failed"
          : ""}
      </h1>
      <div className="card-icon">
        {authState === "upload" && (
          <UploadDocumentImage
            isRetry={false}
            setError={setError}
            setAuthState={setAuthState}
            setIsAuthenticated={setIsAuthenticated}
            setProfileInfo={setProfileInfo}
            setVerificationError={setVerificationError}
          />
        )}
        {authState === "uploading" && <LoadingSpinner />}
        {authState === "success" && <Checkmark size="large" color="#4BB543" />}
        {authState === "failure" && (
          <IoMdCloseCircleOutline color="red" size="60px" />
        )}
      </div>
      <div className="card-subtitle-container">
        {authState === "upload" && (
          <p className="card-subtitle">
            Please upload a government-issued driver's license or passport
          </p>
        )}
        {authState === "uploading" && (
          <p className="card-subtitle">Scanning your document</p>
        )}
        {authState === "success" && (
          <p className="card-subtitle">You have successfully authenticated</p>
        )}
        {authState === "failure" && (
          <>
            <p className="card-subtitle-explanation">{verificationError}</p>
            <UploadDocumentImage
              isRetry={true}
              setError={setError}
              setAuthState={setAuthState}
              setIsAuthenticated={setIsAuthenticated}
              setProfileInfo={setProfileInfo}
              setVerificationError={setVerificationError}
            />
          </>
        )}
        {error && <p className="card-error">{error}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
