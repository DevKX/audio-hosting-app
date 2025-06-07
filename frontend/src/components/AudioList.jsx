import { useState } from "react";
import AudioListItem from "./AudioListItem";

export default function AudioList({ audioFiles }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="p-4 bg-white rounded-md shadow max-w-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Audio Files</h2>
      {audioFiles && audioFiles.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {audioFiles.map((audio) => (
            <AudioListItem
              key={audio.id}
              audio={audio}
              hovered={hoveredId === audio.id}
              onMouseEnter={() => setHoveredId(audio.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No audio files uploaded.</p>
      )}
    </div>
  );
}
