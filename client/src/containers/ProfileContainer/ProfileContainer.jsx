import React, { useEffect, useRef } from "react";
import "./ProfileContainer.css";

const ProfileContainer = ({ profileInfo }) => {
  // Utility function to convert camel case to a human-readable format
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") 
      .replace(/^./, (str) => str.toUpperCase()); 
  };

  const bottomRef = useRef(null);

  // Auto-scroll to bottom when profileInfo changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [profileInfo]);

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <div className="profile-content">
        {Object.entries(profileInfo).map(([sectionKey, sectionValue]) => (
          <div key={sectionKey} className="profile-section">
            <h3>{formatKey(sectionKey)}</h3>
            <ul className="profile-list">
              {Object.entries(sectionValue).map(([key, value]) => (
                <li key={key} className="profile-item">
                  <span className="item-key">{formatKey(key)}:</span>
                  <span className="item-value">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ProfileContainer;
