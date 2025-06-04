import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users] = useState([{ id: 1, email: "test@example.com" }]);
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
        });
    }
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleUpload = (file) => {
    const url = URL.createObjectURL(file);
    setAudioFiles((prev) => [...prev, { id: Date.now(), name: file.name, url }]);
  };

  return isLoggedIn ? (
    <Dashboard users={users} audioFiles={audioFiles} onUpload={handleUpload} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
