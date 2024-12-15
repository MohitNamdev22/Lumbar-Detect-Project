import React from 'react';

export default function AnalysisResult({ result }) {
  if (!result) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Analysis Result</h3>
      <p className="text-gray-600">
        <strong>Class:</strong> {result.class}
      </p>
      <p className="text-gray-600">
        <strong>Confidence:</strong> {result.confidence}
      </p>
    </div>
  );
}
