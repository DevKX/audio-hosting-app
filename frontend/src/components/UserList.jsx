import React from "react";

export default function UserList({ users, onUpdateUser, onCreateUser, onDeleteUser }) {
  return (
    <div className="p-6 bg-white rounded-md shadow max-w-7xl w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">User List</h2>
      <div className="grid grid-cols-4 gap-24 font-semibold underline text-gray-700 mb-2 px-2 text-left">
        <div className="px-4">Username</div>
        <div className="px-4">Email</div>
        <div className="px-4">Status</div>
        <div className="px-4">Action</div>
      </div>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user, idx) => (
            <li
              key={user.id}
              className={`py-2 grid grid-cols-4 gap-24 items-center px-2 ${
                idx !== users.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <span className="font-medium text-gray-800 px-4 text-left">
                {user.username}
              </span>
              <span className="font-medium text-gray-800 px-4 text-left">
                {user.email}
              </span>
              <span className="font-medium text-gray-800 px-4 text-left">
                {user.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => onUpdateUser && onUpdateUser(user)}
                >
                  Update
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                  onClick={() => onDeleteUser && onDeleteUser(user)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
                  </svg>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No users found.</p>
      )}
      <div className="flex justify-end mt-8">
        <button
          className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
          onClick={() => onCreateUser && onCreateUser()}
        >
          Create User
        </button>
      </div>
    </div>
  );
}
