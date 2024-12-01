import React from "react";
import { MdFileUpload } from "react-icons/md";
import axios from "axios";

const UploadDocumentImage = ({
  setError,
  setAuthState,
  setIsAuthenticated,
  setProfileInfo,
  setVerificationError
}) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedExtensions.includes(file.type)) {
        setError("");
        // Call the upload handler
        setAuthState("uploading");
        
        let imageData = await onImageUpload(file);

        if (imageData['isValid'] === 'yes'){
            setProfileInfo({"customerIdentificationProgam": imageData['data'], "customerDueDiligence": {}})
            setAuthState("success");
            setTimeout(() => {
              setIsAuthenticated(true);
            }, 1500);

        } else {
            setAuthState("failure")
            setVerificationError(imageData['reason'])
        }
        
      } else {
        setError("Only JPEG, JPG, or PNG files are allowed.");
      }
    }
  };

  const onImageUpload = async (file) => {
    try {
      // Create FormData to handle the file upload
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

      return response.data
      
    } catch (error) {
      setAuthState("failure");
      // Handle and log any error
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div style={styles.iconContainer}>
      <label htmlFor="file-upload" style={styles.uploadLabel}>
        <MdFileUpload size={48} color="white" />
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".jpeg, .jpg, .png"
        style={styles.fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

const styles = {
  iconContainer: {
    display: "flex",
    justifyContent: "center",
  },
  uploadLabel: {
    cursor: "pointer",
    display: "inline-block",
    borderRadius: "50%",
  },
  fileInput: {
    display: "none", // Hides the default file input
  },
};

export default UploadDocumentImage;
