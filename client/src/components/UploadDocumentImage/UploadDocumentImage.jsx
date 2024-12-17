import React, { useRef } from "react";
import { MdFileUpload } from "react-icons/md";
import axios from "axios";
import "./UploadDocumentImage.css";

const UploadDocumentImage = ({
  isRetry,
  setError,
  setAuthState,
  setIsAuthenticated,
  setProfileInfo,
  setVerificationError,
}) => {
  const fileInputRef = useRef(null); 

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
  
      if (!file) {
        setError("No file selected. Please upload a valid image file.");
        return;
      }
  
      const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedExtensions.includes(file.type)) {
        setError("Only JPEG, JPG, or PNG files are allowed.");
        return;
      }
  
      setError("");
      setAuthState("uploading");
  
      const imageData = await onImageUpload(file);
  
      if (imageData && imageData["isValid"] === "yes") {
        setProfileInfo({
          customerIdentificationProgam: imageData["data"],
          customerDueDiligence: {},
        });
        setAuthState("success");
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1500);
      } else {
        setAuthState("failure");
        setVerificationError(
          imageData?.reason || "Image verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setAuthState("failure");
      setError("An unexpected error occurred. Please try again later.");
    }
  };
  

  const onImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Send the POST request to the backend
      const response = await axios.post(
        "http://localhost:4000/api/verifyIdentity/authenticateWithImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      setAuthState("failure");
      // Handle and log any error
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
    }
  };

  const handleRetryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  return (
    <>
      {isRetry ? (
        <div id="card-failure-retry" onClick={handleRetryClick}>
          <div className="retry-container">
            <div className="retry-icon">
              <MdFileUpload size={50} color="#333" />
            </div>
            <div className="retry-text">
              <div className="retry-title">Upload document again</div>
              <div className="retry-subtitle">
                Make sure the image is clear and all fields are visible
              </div>
            </div>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpeg, .jpg, .png"
            className="file-input"
            onChange={handleFileChange}
            style={{ display: "none" }} 
          />
        </div>
      ) : (
        <div className="icon-container">
          <label htmlFor="file-upload" className="upload-label">
            <MdFileUpload size={80} color="#333" id="upload-icon" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".jpeg, .jpg, .png"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>
      )}
    </>
  );
};

export default UploadDocumentImage;
