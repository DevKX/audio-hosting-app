export default function UserListItem({ user, onUpdateUser, onDeleteUser, isLast }) {
  return (
    <li
      className={`py-2 grid grid-cols-4 gap-24 items-center px-2 ${
        !isLast ? "border-b border-gray-200" : ""
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
  );
}