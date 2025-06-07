import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MessageConsole from "./components/MessageConsole";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [consoleMessage, setConsoleMessage] = useState("");
  const [consoleType, setConsoleType] = useState("info");
  const [currentLogonUser, setCurrentLogonUser] = useState(null);
  const [ token, setToken ] = useState(localStorage.getItem("authToken"));

  // To ensure that logon user has been verified and backend
  // Do nothing when user did not login
  // If user logged in, then verify the token and fetch current logon user
  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      setCurrentLogonUser(null);
      return;
    }
    axios
      .get("/api/users/currentLogonUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsLoggedIn(true);
        setCurrentLogonUser(res.data.user);
      })
      .catch((err) => {
        showConsoleMessage(err.response?.data?.message || "Session expired", "error");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setCurrentLogonUser(null);
        setToken(null);
      });
  }, [token]);

  


  // Handle login and store token in localStorage and token state
  const handleLogin = (user) => {
    if (!user?.token) {
      showConsoleMessage("Login failed: No token received", "error");
      return;
    }
    // Store token in localStorage
    localStorage.setItem("authToken", user.token);
    setToken(user.token);
    setIsLoggedIn(true);
  };


  // Show console message. This function will be passsed down to child componnents in dashboard and login
  function showConsoleMessage(message, type = "info", duration = 3000) {
    setConsoleMessage(message);
    setConsoleType(type);
    if (duration > 0) {
      setTimeout(() => setConsoleMessage(""), duration);
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard showConsoleMessage={showConsoleMessage} currentLogonUser={currentLogonUser}/>
      ) : (
        <Login onLogin={handleLogin} showConsoleMessage={showConsoleMessage} />
      )}
      <MessageConsole message={consoleMessage} type={consoleType} />
    </>
  );
}
