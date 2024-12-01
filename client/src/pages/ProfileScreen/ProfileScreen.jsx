import React from "react";
import "./ProfileScreen.css";
import ProfileContainer from "../../containers/ProfileContainer";
import ChatContainer from "../../containers/ChatContainer";

const ProfileScreen = ({ profileInfo, setProfileInfo }) => {
  return (
    <div className="profile-screen">
      <div className="main-content">
        <ProfileContainer profileInfo={profileInfo} />
        <ChatContainer profileInfo={profileInfo} setProfileInfo={setProfileInfo} />
      </div>
    </div>
  );
};

export default ProfileScreen;
