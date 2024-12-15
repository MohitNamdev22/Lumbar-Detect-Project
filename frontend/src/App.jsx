import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    setResult(null); // Reset result when a new file is selected
    setError(null); // Reset error when a new file is selected
  };

  // Use Dropzone for drag-and-drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".jpg, .jpeg, .png, .dcm", // Adjust for valid file types
  });

  // Start analyzing the MRI
  const analyzeMRI = async () => {
    setLoading(true);
    setLoadingProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 100) {
          return prev + 5;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setLoadingProgress(percent);
        },
      });

      setResult(response.data);
      setError(null); // Clear error if the request succeeds
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Handle the error response from the API
        setError(err.response.data.detail);
      } else {
        console.error("Error during file upload", err);
      }
      setResult(null); // Clear result if the request fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#c1cdf0] flex flex-col items-center py-12">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-8 text-center">Lumbar Disc Herniation Detection</h1>

      {/* File Upload Box */}
      <div
        className="w-11/12 md:w-1/2 p-6 border-2 border-dashed rounded-lg shadow-lg"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-4" />
          <p className="text-lg text-gray-700">Drag and drop your MRI image here, or click to select a file</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            Select File
          </button>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        className={`mt-6 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg ${
          !file ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        onClick={analyzeMRI}
        disabled={!file}
      >
        Analyze MRI
      </button>

      {file && <p className="mt-4 text-gray-600">Selected file: {file.name}</p>}

      {/* Loading Bar */}
      {loading && (
        <div className="w-full max-w-md mt-8 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between mb-2">
            <div className="px-4 py-1 bg-blue-200 rounded-md">Loading</div>
            <div>{loadingProgress}%</div>
          </div>
          <div className="h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {result && !loading && (
        <div className="w-11/12 md:w-1/2 mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Classification Result</h3>
          <div className="flex items-center mt-4">
            <div
              className={`w-6 h-6 rounded-full ${
                result.class === "Herniated" ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <p className="ml-4 text-lg">
              {result.class} - {result.confidence}
            </p>
          </div>
          <p className="mt-4 text-gray-600">
            {result.class === "Herniated"
              ? "This result suggests a herniated lumbar disc. Please consult with a healthcare professional for a comprehensive evaluation and diagnosis."
              : "The MRI suggests no signs of lumbar disc herniation."}
          </p>
        </div>
      )}

      {/* Error Section */}
      {error && !loading && (
        <div className="w-11/12 md:w-1/2 mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-red-600">Error</h3>
          <p className="mt-4 text-gray-600">{error}</p>
        </div>
      )}
    </div>
  );
}
