import React, { useState } from 'react';
import { Upload, ImageIcon, AlertCircle } from 'lucide-react';

export default function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileUpload(droppedFile);
    }
  };

  const handleDragOver = (event) => event.preventDefault();

  return (
    <div
      className="p-4 border-dashed border-2 border-gray-400 rounded-lg flex flex-col items-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="w-12 h-12 text-gray-400" />
      <p className="text-gray-600">Drag and drop your file here, or click to upload</p>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer text-blue-500 underline">
        Browse files
      </label>
      {error && (
        <div className="text-red-500 flex items-center mt-2">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}
