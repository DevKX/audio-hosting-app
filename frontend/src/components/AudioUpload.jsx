import React, { useState } from "react";

export default function AudioUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (file && onUpload) {
      onUpload(file);
      setFile(null);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border border-gray-300 rounded-md shadow-sm bg-white max-w-md"
    >
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload Audio File
      </label>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-indigo-50 file:text-indigo-700
                   hover:file:bg-indigo-100"
      />
      <button
        type="submit"
        disabled={!file}
        className={`mt-4 px-4 py-2 rounded-md text-white font-semibold
          ${file ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Upload
      </button>
    </form>
  );
}
