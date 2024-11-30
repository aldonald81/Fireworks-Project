import React, { useState } from "react";
import UploadDocumentImage from "../../components/UploadDocumentImage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Checkmark } from "react-checkmark";
import { IoMdCloseCircleOutline } from "react-icons/io";

const AuthModal = ({ setIsAuthenticated, setProfileInfo }) => {
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [authState, setAuthState] = useState("upload");

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Welcome!</h1>

      {authState === "upload" ? (
        <>
          <UploadDocumentImage
            setError={setError}
            setAuthState={setAuthState}
            setIsAuthenticated={setIsAuthenticated}
            setProfileInfo={setProfileInfo}
            setVerificationError={setVerificationError}
          />
          <p style={styles.subtitle}>
            Please upload a government-issued driver's license or passport
          </p>
          {error && <p style={styles.error}>{error}</p>}
        </>
      ) : authState === "uploading" ? (
        <>
          <LoadingSpinner />
          <p style={styles.subtitle}>Scanning your document </p>
        </>
      ) : authState === "success" ? (
        <>
          <Checkmark size="large" color="#4BB543" />
          <p style={styles.subtitle}>Success!</p>
        </>
      ) : authState === "failure" ? (
        <>
          <IoMdCloseCircleOutline color="red" size="60px" />
          <p style={styles.subtitle}>Verification Failed</p>
          <p style={styles.subtitle}>
            We were unable to confirm your identity: {verificationError}
          </p>
        </>
      ) : (
        setAuthState("upload")
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#6A509E",
    borderRadius: "16px",
    padding: "10px 40px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "320px",
    zIndex: 1, // Ensures it appears above the background
    position: "relative",
  },
  title: {
    color: "white",
    fontSize: "24px",
    marginBottom: "30px",
  },

  subtitle: {
    color: "white",
    fontSize: "16px",
    marginTop: "8px",
  },
  error: {
    color: "#FF6347",
    fontSize: "14px",
    marginTop: "12px",
  },
};

export default AuthModal;
