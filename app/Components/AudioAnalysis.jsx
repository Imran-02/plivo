import { useState } from 'react';

export default function AudioAnalysis() {
  const [audioFile, setAudioFile] = useState(null);
  const [results, setResults] = useState({
    transcript: '',
    diarizedText: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAudioFile(e.target.files[0]);
      setError(''); // Clear error when new file is selected
      setResults({ transcript: '', diarizedText: '' }); // Clear previous results
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults({ transcript: '', diarizedText: '' });
    
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const res = await fetch('/api/conversation', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(err.message || 'An error occurred while processing the audio');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Conversation Analysis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Upload Audio File:</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!audioFile || isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Analyze'}
        </button>
      </form>

      {results.transcript && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">Transcript</h3>
            <div className="p-4 bg-gray-50 text-black rounded whitespace-pre-wrap">
              {results.transcript}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Diarized Text</h3>
            <div className="p-4 bg-gray-50 text-black rounded whitespace-pre-wrap">
              {results.diarizedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}