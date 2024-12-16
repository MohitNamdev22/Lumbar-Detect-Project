import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Upload, ChevronRight, AlertCircle, ImageIcon, CircleCheckIcon, CrossIcon, BanIcon, Circle } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Handle file selection
  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setResult(null); // Reset result when a new file is selected
    setError(null); // Reset error when a new file is selected
    setIsAnalyzed(false);
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
      setIsAnalyzed(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Handle the error response from the API
        setError(err.response.data.detail);
      } else {
        console.error("Error during file upload", err);
      }
      setResult(null); // Clear result if the request fails
    } finally {
      setTimeout(() => {
        setLoading(false);

      }, 3000)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Lumbar Disc Herniation Detection</h1>

        <div
          className="bg-white shadow-2xl rounded-3xl overflow-hidden"
        >
          <div className="p-8">
            {/* <input {...getInputProps()} /> */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50"
              {...getRootProps()} >
              {/* <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-4" /> */}
              <Upload className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-lg text-gray-600">Drag and drop your MRI image here, or click to select a file</p>
              <input {...getInputProps()} className="hidden" accept=".jpg, .png, .dcm"/>
              <button
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(event) => {
                event.stopPropagation(); // Prevent opening the file picker
                document.querySelector('input[type="file"]').click();
              }}
            >
              Select File
            </button>


            {file && <p className="mt-4 text-sm text-gray-600 text-center">Selected file: {file.name}</p>}

            {/* Analyze Button
      <button
        className={`mt-8 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
          !file ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        onClick={analyzeMRI}
        disabled={!file}
      >
        Analyze MRI
      </button> */}

            <button
              onClick={(event) => {
                event.stopPropagation();
                analyzeMRI();
              }}
              disabled={!file || loading || isAnalyzed}
              className="mt-8 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze MRI'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Loading Bar */}
          {/* {loading && (
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
      </div> */}

          {loading && (
            <div className="px-8 pt-8 pb-8">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      Processing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                      {loadingProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div
                    style={{ width: `${loadingProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-300 ease-in-out"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Result Section */}
      {result && !loading && (
        <div className="mt-12 bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Classification Result</h3>
            <div className="flex items-center space-x-4">
              {/* <div
              className={`w-6 h-6 rounded-full ${
                result.class === "Herniated" ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <p className="ml-4 text-lg">
              {result.class} - {result.confidence}
            </p> */}

              {result.class === 'Herniated' ? (
                <AlertCircle className="h-12 w-12 text-red-500" />
              ) : (
                <CircleCheckIcon className="h-12 w-12 text-green-500" />
              )}

              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {result.class}
                </p>
                <p className="text-xl text-gray-600">
                  {result.class} with {result.confidence} confidence
                </p>
              </div>


            </div>
            <p className="mt-4 text-gray-600">
              {result.class === "Herniated"
                ? "This result suggests a herniated lumbar disc. Please consult with a healthcare professional for a comprehensive evaluation and diagnosis."
                : "The MRI suggests no signs of lumbar disc herniation."}
            </p>
          </div>
        </div>
      )}

      {/* Error Section */}
      {error && !loading && (
        <div className="mt-12 bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-4">
              <BanIcon className="h-12 w-12 text-red-500" />
              <h3 className="text-3xl font-bold text-red-600">Error</h3>
            </div>
            <p className="mt-4 text-gray-600">{error}</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
