import React, { useState, useEffect } from "react";
import UserList from "../components/UserList";
import AudioList from "../components/AudioList";
import AudioUpload from "../components/AudioUpload";
import UserForm from "../components/UserForm";
import axios from "axios";

const TABS = [
  { key: "users", label: "Users" },
  { key: "audio", label: "Audio List" },
  { key: "upload", label: "Upload Audio" },
];

export default function Dashboard({ showConsoleMessage }) {
  const [selectedTab, setSelectedTab] = useState("audio");
  const [users, setUsers] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formMode, setFormMode] = useState("");
  const [currentLogonUser, setCurrentLogonUser] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => {
        showConsoleMessage(err.response.data.message, "error");

        setUsers([]);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("/api/audio", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAudioFiles(res.data.audioFiles);
      })
      .catch((err) => {
        showConsoleMessage(err.response.data.message, "error");
        setAudioFiles([]);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get("/api/users/currentLogonUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentLogonUser(res.data.user);
      })
      .catch((err) => {
        showConsoleMessage(err.response.data.message, "error");
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      });
  }, [token]);


  function handleAudioUpload({ file, title, description, isPublic, category }) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_public", isPublic);
    formData.append("category", category);

    axios
      .post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
       handleUploadAudioMetadata(res.data);
      })
      .catch((err) => {
        showConsoleMessage(err.response.data.message, "error");
      });
  }

  function handleUploadAudioMetadata(fileData) {
    axios
          .post(
            "/api/audio",
            {
              file_path: fileData.fileUrl,
              filename: fileData.filename,
              title: fileData.title,
              description: fileData.description,
              file_size: fileData.file_size,
              duration_seconds: fileData.duration_seconds,
              is_public: fileData.isPublic,
              category: fileData.category,
              mime_type: fileData.mime_type,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .then((res) => {
            
            setAudioFiles((prev) => [...prev, res.data]);
            showConsoleMessage(res.data.message, "success");
          })
          .catch((err) => {
            // If metadata upload fails, delete the uploaded file
            axios
              .delete(`/api/upload/${fileData.filename}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then(() => {
                showConsoleMessage(
                  "Audio Upload failed. Uploaded file removed.",
                  "error"
                );
              })
              .catch(() => {
                showConsoleMessage(
                  "Audio upload failed. Please contact support to delete the audio file.",
                  "error"
                );
              });
          });
  }

  

  function handleCreateUser() {
    setEditingUser(null);
    setFormMode("create");
    setShowUserForm(true);
  }

  function handleUpdateUser(user) {
    setEditingUser(user);
    setFormMode("update");
    setShowUserForm(true);
  }

  function handleDeleteUser(user) {
    setEditingUser(user);
    setFormMode("delete");
    setShowUserForm(true);
  }

  function handleUserFormSubmit(userData) {
    if (formMode === "create") {
      axios
        .post(
          "/api/users",
          {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            is_active: userData.is_active,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setUsers((prev) => {
            showConsoleMessage(res.data.message, "success");
            return [...prev, res.data.user];
          });
        })
        .catch((err) => {
          showConsoleMessage(err.response.data.message, "error");
        });
    } else if (formMode === "update") {
      axios
        .put(
          `/api/users/${userData.id}`,
          {
            username: userData.username,
            password: userData.password,
            email: userData.email,
            is_active: userData.is_active,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          showConsoleMessage(res.data.message, "success");
          setUsers((prev) =>
            prev.map((user) => (user.id === res.data.user.id ? res.data.user : user))
          );
        })
        .catch((err) => {
          showConsoleMessage(err.response.error, "error");
        });
    } else if (formMode === "delete") {
      axios
        .delete(`/api/users/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          {
            showConsoleMessage(res.data.message, "success");
            setUsers((prev) => prev.filter((user) => user.id !== userData.id));
          }
        })
        .catch((err) => {
          console.error(err);
          showConsoleMessage(err.response.data.message, "error");
        });
    }
    setShowUserForm(false);
  }

  function handleUserFormCancel() {
    setShowUserForm(false);
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }

  // Only show "Users" tab if currentLogonUser is admin
  const filteredTabs = TABS.filter((tab) => {
    if (tab.key === "users" && currentLogonUser?.role !== "admin") {
      return false;
    }
    return true;
  });

  if (!currentLogonUser) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-48 bg-purple-800 flex flex-col py-8 px-2">
        <h2 className="text-white text-xl font-bold mb-8 text-center">Menu</h2>
        {filteredTabs.map((tab) => (
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
        <button
          className="mt-auto mb-4 px-4 py-2 rounded text-white text-left transition font-semibold hover:bg-purple-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-8 relative">
        <div className="absolute top-8 right-8 flex flex-col items-end space-y-2">
          <div className="text-gray-700 text-lg font-semibold">
            {currentLogonUser && <>Welcome, {currentLogonUser.username}!</>}
          </div>
        </div>

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
                  submitLabel={
                    formMode.charAt(0).toUpperCase() + formMode.slice(1)
                  }
                  readOnly={formMode === "delete"}
                />
              </div>
            )}
          </>
        )}
        {selectedTab === "audio" && <AudioList audioFiles={audioFiles} />}
        {selectedTab === "upload" && <AudioUpload onUpload={handleAudioUpload} />}
      </div>
    </div>
  );
}