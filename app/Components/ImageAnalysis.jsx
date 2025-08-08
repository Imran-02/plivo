'use client'
import { useState } from 'react';

export default function ImageAnalysis() {
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setDescription('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/analyse', {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header manually for FormData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setDescription(data.description);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Image Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={isProcessing}
          />
        </div>

        {error && (
          <div className="p-2 text-red-600 text-sm bg-red-50 rounded">
            Error: {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!imageFile || isProcessing}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>

      {description && (
        <div className="mt-6 p-4 bg-black rounded-md">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}