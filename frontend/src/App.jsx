import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logonUser, setLogonUser] = useState(null); // Renamed from user
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsLoggedIn(true))
        .catch(() => {
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setLogonUser(null);
        });
    }
  }, []);

  const handleLogin = (user) => {
    if (!user?.token) {
      console.error("No token found in user object:", user);
      return;
    }

    // Store token in localStorage
    localStorage.setItem("authToken", user.token);

    // Decode token and store user information
    const decoded = jwtDecode(user.token);
    localStorage.setItem("username", decoded.username); // Store username from JWT
    console.log("Decoded user:", decoded);

    setIsLoggedIn(true);
    setLogonUser(decoded); // Store decoded user info in state
  };

  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setAudioFiles((prev) => [...prev, { id: Date.now(), name: file.name, url }]);
  };

  return isLoggedIn ? (
    <Dashboard
      logonUser={logonUser}
      audioFiles={audioFiles}
      onUpload={handleUpload}
    />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
