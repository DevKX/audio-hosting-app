import React, { useState } from "react";

export default function AudioList({ audioFiles }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="p-4 bg-white rounded-md shadow max-w-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Audio Files</h2>
      {audioFiles && audioFiles.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {audioFiles.map((audio) => (
            <li
              key={audio.id}
              className="py-2 flex justify-between items-center"
              onMouseEnter={() => setHoveredId(audio.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="font-medium text-gray-800 relative mr-6">
                {audio.title}
                {hoveredId === audio.id && (
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
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No audio files uploaded.</p>
      )}
    </div>
  );
}
