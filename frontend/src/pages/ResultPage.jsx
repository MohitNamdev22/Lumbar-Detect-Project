import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnalysisResult from '../components/AnalysisResult';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  if (!result) {
    return (
      <div className="container mx-auto text-center py-12">
        <h1 className="text-2xl text-gray-800">No results found!</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <AnalysisResult result={result} />
    </div>
  );
}
