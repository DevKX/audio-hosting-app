import React, { useState, useEffect } from "react";
import UserList from "../components/UserList";
import AudioList from "../components/AudioList";
import AudioUpload from "../components/AudioUpload";
import UserForm from "../components/userForm"; // Import your form
import axios from "axios";

const TABS = [
  { key: "users", label: "Users" },
  { key: "audio", label: "Audio List" },
  { key: "upload", label: "Upload Audio" },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [audioFiles] = useState([
    { id: 1, title: "Birdsong", url: "/audio/birdsong.mp3" },
    { id: 2, title: "Ocean Waves", url: "/audio/ocean-waves.mp3" },
  ]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formMode, setFormMode] = useState(""); // create, update or delete

  useEffect(() => {
    // Fetch users from backend API
    axios.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });
  }, []);

  function handleUpload(file) {
    alert(`Uploading file: ${file.name}`);
  }

  // Show form for create
  function handleCreateUser() {
    setEditingUser(null);
    setFormMode("create");
    setShowUserForm(true);
  }

  // Show form for update
  function handleUpdateUser(user) {
    setEditingUser(user);
    setFormMode("update"); 
    setShowUserForm(true);
  }

  // Show form for delete
  function handleDeleteUser(user) {
    setEditingUser(user);
    setFormMode("delete"); 
    setShowUserForm(true);
  }

  function handleUserFormSubmit(userData) {
    if (formMode === "create") {
      // Handle create user
      console.log("Creating user:", userData);
      axios.post("/api/users", {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        is_active: userData.is_active,
      })
        .then(res => {
          setUsers(prev => [...prev, res.data]);
        })
        .catch(err => {
          alert("Failed to create user.");
        });
  } else if (formMode === "update") {
    // Handle update user
    console.log("Updating user:", userData);
    axios.put(`/api/users/${userData.id}`, {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      is_active: userData.is_active,
    })
      .then(res => {
        setUsers(prev => prev.map(user => (user.id === res.data.id ? res.data : user)));
      })
      .catch(err => {
        alert("Failed to update user.");
      });
  } else if (formMode === "delete") {
    // Handle delete user
    console.log("Deleting user:", userData);
    axios.delete(`/api/users/${userData.id}`)
      .then(() => {
        setUsers(prev => prev.filter(user => user.id !== userData.id));
      })
      .catch(err => {
        alert("Failed to delete user.");
      });
  }
    setShowUserForm(false);
  }

  function handleUserFormCancel() {
    setShowUserForm(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-purple-800 flex flex-col py-8 px-2">
        <h2 className="text-white text-xl font-bold mb-8 text-center">Menu</h2>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`mb-4 px-4 py-2 rounded text-white text-left transition font-semibold ${
              selectedTab === tab.key
                ? "bg-purple-600"
                : "hover:bg-purple-700"
            }`}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {selectedTab === "users" && (
          <>
            <UserList
              users={users}
              onUpdateUser={handleUpdateUser}
              onCreateUser={handleCreateUser}
              onDeleteUser={handleDeleteUser}
            />
            {showUserForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <UserForm
                initialValues={editingUser}
                onSubmit={handleUserFormSubmit}
                onCancel={handleUserFormCancel}
                submitLabel={formMode.charAt(0).toUpperCase() + formMode.slice(1)}
                readOnly={formMode === "delete"}
                // When formMode is delete, readOnly will be true
              />
              </div>
            )}
          </>
        )}
        {selectedTab === "audio" && <AudioList audioFiles={audioFiles} />}
        {selectedTab === "upload" && <AudioUpload onUpload={handleUpload} />}
      </div>
    </div>
  );
}