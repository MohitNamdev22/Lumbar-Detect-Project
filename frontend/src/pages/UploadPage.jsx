import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Pass result to result page
      navigate('/result', { state: { result: response.data } });
    } catch (err) {
      console.error(err);
      setError('Error analyzing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Upload MRI for Analysis
      </h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
