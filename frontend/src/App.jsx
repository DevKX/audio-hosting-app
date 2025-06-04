import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users] = useState([{ id: 1, email: "test@example.com" }]);
  const [audioFiles, setAudioFiles] = useState([]);

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
