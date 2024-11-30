import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});
  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        profileInfo={profileInfo}
        setProfileInfo={setProfileInfo}
      />
    </Router>
  );
};

export default App;
