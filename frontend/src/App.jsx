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
        });
    }
  }, []);

  const handleLogin = (user) => {
    if (!user?.token) {
      showConsoleMessage("Login failed: No token received", "error");
      return;
    }

    // Store token in localStorage
    localStorage.setItem("authToken", user.token);
    setIsLoggedIn(true);
  };


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
        <Dashboard showConsoleMessage={showConsoleMessage} />
      ) : (
        <Login onLogin={handleLogin} showConsoleMessage={showConsoleMessage} />
      )}
      <MessageConsole message={consoleMessage} type={consoleType} />
    </>
  );
}
