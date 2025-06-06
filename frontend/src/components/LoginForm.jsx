import { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin, showConsoleMessage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
      axios
      .post("/api/auth/login", { username, password }, {
      })
      .then((res) => {
       const { token } = res.data.token;
      localStorage.setItem("authToken", token);
      if (onLogin) onLogin({ token });
      })
      .catch((err) => {
        showConsoleMessage(err.response.data.message , "error");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <input
        type="text"
        className="w-full p-3 border-2 border-blue-900 rounded bg-white focus:outline-none focus:border-blue-500 transition"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
      />
      <input
        type="password"
        className="w-full p-3 border-2 border-blue-900 rounded bg-white focus:outline-none focus:border-blue-500 transition"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-3 rounded font-semibold border-2 border-blue-900 hover:bg-blue-700 hover:border-blue-500 hover:shadow-lg transition"
      >
        Login
      </button>
    </form>
  );
}
