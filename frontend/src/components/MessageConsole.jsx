import React, { useEffect, useState } from "react";

export default function MessageConsole({ message, err, type = "info" }) {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  if (err) {
    message = `Error: ${err.message || err}`;
  }

  useEffect(() => {
    if (message) {
      setVisible(true);
      // Start with fade-in
      setFade(true);
      // Remove fade after a short delay for fade-in
      const fadeInTimeout = setTimeout(() => setFade(false), 50);
      // Start fade out after 2.5s, hide after 3s
      const fadeOutTimeout = setTimeout(() => setFade(true), 2500);
      const hideTimeout = setTimeout(() => setVisible(false), 3000);
      return () => {
        clearTimeout(fadeInTimeout);
        clearTimeout(fadeOutTimeout);
        clearTimeout(hideTimeout);
      };
    } else {
      setVisible(false);
      setFade(false);
    }
  }, [message]);

  if (!visible) return null;

  let styles =
    "font-mono px-6 py-3 border shadow text-sm max-w-md bg-opacity-90 transition-opacity duration-500";
  switch (type) {
    case "success":
      styles += " bg-green-100 border-green-300 text-green-800";
      break;
    case "error":
      styles += " bg-red-100 border-red-300 text-red-800";
      break;
    case "warning":
      styles += " bg-yellow-100 border-yellow-300 text-yellow-800";
      break;
    default:
      styles += " bg-gray-100 border-gray-300 text-blue-800";
  }

  return (
    <div
      className={styles}
      style={{
        whiteSpace: "pre-wrap",
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        opacity: fade ? 0 : 1, // <-- more opaque
        pointerEvents: "none",
        transition: "opacity 0.5s",
      }}
    >
      {message}
    </div>
  );
}