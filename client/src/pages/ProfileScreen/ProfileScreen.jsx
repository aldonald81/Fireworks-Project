import React from "react";
import "./ProfileScreen.css";
import ProfileContainer from "../../containers/ProfileContainer";
import VooContainer from "../../containers/VooContainer";
import ChatContainer from "../../containers/ChatContainer";

const ProfileScreen = ({profileInfo}) => {
  return (
    <div className="profile-screen">
      <VooContainer />

      <div className="main-content">
        <ProfileContainer profileInfo={profileInfo} />
        <ChatContainer />
      </div>
    </div>
  );
};

export default ProfileScreen;
