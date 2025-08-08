import { useState } from 'react'

export default function Summarization() {
  const [inputType, setInputType] = useState('file')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [characterCount, setCharacterCount] = useState(0)

  const handleFileChange = (e) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUrlChange = (e) => {
    setError(null)
    setUrl(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    try {
      const formData = new FormData()

      if (inputType === 'file') {
        if (!file) {
          throw new Error('Please select a file')
        }
        formData.append('file', file)
      } else {
        if (!url) {
          throw new Error('Please enter a URL')
        }
        if (!url.match(/^https?:\/\/.+/)) {
          throw new Error('Please enter a valid URL (starting with http:// or https://)')
        }
        formData.append('url', url)
      }

      const response = await fetch('/api/summarization', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      setSummary(data.summary)
      setCharacterCount(data.characterCount)
    } catch (error) {
      setError(error.message)
      console.error('Summarization error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Document Summarization</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setInputType('file')
            setError(null)
          }}
          className={`px-6 py-3 rounded-lg transition-all ${
            inputType === 'file'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          File Upload
        </button>
        <button
          onClick={() => {
            setInputType('url')
            setError(null)
          }}
          className={`px-6 py-3 rounded-lg transition-all ${
            inputType === 'url'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          URL Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inputType === 'file' ? (
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Upload Document
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100
                  file:transition-all file:duration-200"
              />
              {file && (
                <span className="text-sm text-gray-500">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, DOC, TXT (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Enter Article URL
            </label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/article"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || (inputType === 'file' ? !file : !url)}
          className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
      </form>

      {summary && (
        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">Summary</h3>
            {characterCount > 0 && (
              <span className="text-sm text-gray-500">
                {characterCount.toLocaleString()} characters processed
              </span>
            )}
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-line">
            {summary}
          </div>
        </div>
      )}
    </div>
  )
}