import React, {  } from "react";
import AuthModal from "../../containers/AuthModal";

const AuthScreen = ({setIsAuthenticated, setProfileInfo}) => {

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <AuthModal setIsAuthenticated={setIsAuthenticated} setProfileInfo={setProfileInfo}/>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden", // Prevent background from overflowing
    backgroundColor: "#EEEEEF",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "65vh",
    backgroundColor: "#FFDB9D",
    clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)",
    zIndex: 0, // Keeps the background behind other elements
  },
};

export default AuthScreen;
