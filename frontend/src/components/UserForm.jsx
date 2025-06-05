import React, { useState, useEffect } from "react";

export default function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Update",
  readOnly = false
}) {
    // Set initial values to safeInitial (Update)
    // else set to empty (Create)
    // Password is always empty
  const safeInitial = initialValues || {};
  const [id, setId] = useState(safeInitial.id || null);
  const [username, setUsername] = useState(safeInitial.username || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(safeInitial.email || "");
  const [isActive, setIsActive] = useState(
    safeInitial.is_active !== undefined ? safeInitial.is_active : true
  );

  // Reset form fields when initalvalues change
  // To switch form between Create and Update
  useEffect(() => {
    setId(initialValues?.id || null);
    setUsername(initialValues?.username || "");
    setEmail(initialValues?.email || "");
    setIsActive(
      initialValues?.is_active !== undefined ? initialValues.is_active : true
    );
    setPassword("");
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit &&
      onSubmit({
        id,
        username,
        password: password || undefined,
        email,
        is_active: isActive,
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-md shadow max-w-md w-full flex flex-col gap-4"
      style={{ fontFamily: "monospace" }}
    >
      <div>
        <label className="block mb-1">Username:</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          readOnly={readOnly}
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block mb-1">Password:</label>
        <input
          type="password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          readOnly={readOnly}
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={readOnly}
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block mb-1">Status:</label>
        <select
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={isActive ? "active" : "inactive"}
          onChange={(e) => setIsActive(e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-4 justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}