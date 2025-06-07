export default function AudioListItem({ audio, hovered, onMouseEnter, onMouseLeave }) {
  return (
    <li className="py-2 flex justify-between items-center">
      <span
        className="font-medium text-gray-800 relative mr-6"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {audio.title}
        {hovered && (
          <div className="absolute left-0 mt-2 p-2 bg-gray-100 border rounded shadow text-sm z-10">
            <div><strong>Filename:</strong> {audio.filename}</div>
            <div><strong>Category:</strong> {audio.category || "N/A"}</div>
            <div><strong>Description:</strong> {audio.description || "N/A"}</div>
            <div><strong>Uploaded by:</strong> {audio.uploaded_by || "Unknown"}</div>
          </div>
        )}
      </span>
      <div className="ml-4">
        <audio controls className="max-w-xs">
          <source src={audio.sasUrl} type={audio.mime_type || "audio/mpeg"} />
          Your browser does not support the audio element.
        </audio>
      </div>
    </li>
  );
}