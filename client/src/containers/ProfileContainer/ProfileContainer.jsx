import React from "react";
import "./ProfileContainer.css";

const ProfileContainer = ({ profileInfo }) => {
  // Utility function to convert camel case to a human-readable format
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add a space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <ul className="profile-list">
        {Object.entries(profileInfo).map(([key, value]) => (
          <li key={key}>
            <strong>{formatKey(key)}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileContainer;
