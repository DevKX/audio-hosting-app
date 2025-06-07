import React from "react";
import UserListItem from "./UserListItem.jsx";

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
            <UserListItem
              key={user.id}
              user={user}
              onUpdateUser={onUpdateUser}
              onDeleteUser={onDeleteUser}
              isLast={idx === users.length - 1}
            />
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
