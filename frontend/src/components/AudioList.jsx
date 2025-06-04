import React from "react";

export default function AudioList({ audioFiles }) {
  return (
    <div className="p-4 bg-white rounded-md shadow max-w-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">Audio Files</h2>
      {audioFiles && audioFiles.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {audioFiles.map((audio) => (
            <li key={audio.id} className="py-2 flex justify-between items-center">
              <span className="font-medium text-gray-800">{audio.title}</span>
              <audio controls className="max-w-xs">
                <source src={audio.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No audio files uploaded.</p>
      )}
    </div>
  );
}
