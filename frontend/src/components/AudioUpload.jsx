import React, { useState } from "react";

export default function AudioUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [category, setCategory] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (file && onUpload) {
      // Pass all form data to Dashboard
      onUpload({ file, title, description, isPublic, category });
      // Clear all form fields
      setFile(null);
      setTitle("");
      setDescription("");
      setIsPublic(false);
      setCategory("");
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

      <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="block w-full mb-2 border rounded px-2 py-1"
        required
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="block w-full mb-2 border rounded px-2 py-1"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="block w-full mb-2 border rounded px-2 py-1"
        required
      >
        <option value="">Select a category</option>
        <option value="Interview">Interview</option>
        <option value="Evidence">Evidence</option>
        <option value="Surveillance">Surveillance</option>
        <option value="Communication">Communication</option>
      </select>

      <label className="inline-flex items-center mt-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
          className="form-checkbox"
        />
        <span className="ml-2">Public</span>
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!file || !title}
          className={`mt-4 px-4 py-2 rounded-md text-white font-semibold
            ${file && title ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Upload
        </button>
      </div>
    </form>
  );
}
