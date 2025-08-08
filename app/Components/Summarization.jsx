import { useState } from 'react';

export default function Summarization() {
  const [inputType, setInputType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formData = new FormData();

      if (inputType === 'file' && file) {
        formData.append('file', file);
      } else if (inputType === 'url' && url) {
        formData.append('url', url);
      } else {
        alert('Please provide either a file or URL');
        return;
      }

      const response = await fetch('/api/summarization', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error during summarization:', error);
      alert('Failed to generate summary');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Document/URL Summarization</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setInputType('file')}
          className={`px-4 py-2 rounded ${inputType === 'file' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          File Upload
        </button>
        <button
          onClick={() => setInputType('url')}
          className={`px-4 py-2 rounded ${inputType === 'url' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          URL Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputType === 'file' ? (
          <div>
            <label className="block mb-2">Upload Document (PDF/DOC):</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100"
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2">Enter URL:</label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/article"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || (inputType === 'file' ? !file : !url)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Generate Summary'}
        </button>
      </form>

      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-2">Summary</h3>
          <div className="p-4 bg-gray-50 rounded">{summary}</div>
        </div>
      )}
    </div>
  );
}
