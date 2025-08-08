'use client'
import { useState } from 'react'
import * as mammoth from 'mammoth'

export default function Summarization() {
  const [inputType, setInputType] = useState('file')
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ characterCount: 0, fileType: '' })

  const handleFileChange = (e) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit')
      return
    }
    setFile(selectedFile)
  }

  const handleUrlChange = (e) => setUrl(e.target.value)

  const extractDocxText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (err) {
      throw new Error('Failed to extract text from DOCX file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    try {
      const formData = new FormData()
      let text = ''

      if (inputType === 'file' && file) {
        const fileName = file.name.toLowerCase()
        
        if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
          text = await extractDocxText(file)
          formData.append('text', text)
        } else {
          formData.append('file', file)
        }
      } else if (inputType === 'url' && url) {
        if (!url.match(/^https?:\/\/.+/i)) {
          throw new Error('Invalid URL format. Must start with http:// or https://')
        }
        formData.append('url', url)
      } else {
        throw new Error('Please provide either a file or URL')
      }

      const response = await fetch('/api/summarization', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setSummary(data.summary)
      setStats({
        characterCount: data.characterCount,
        fileType: data.fileType
      })
    } catch (error) {
      setError(error.message)
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Document Summarizer</h1>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setInputType('file')}
          className={`px-6 py-3 rounded-lg transition-all ${
            inputType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          File Upload
        </button>
        <button
          onClick={() => setInputType('url')}
          className={`px-6 py-3 rounded-lg transition-all ${
            inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          URL Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputType === 'file' ? (
          <div className="space-y-2">
            <label className="block text-lg font-medium">Upload Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              Supports: PDF, DOCX (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-lg font-medium">Article URL</label>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/article"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || (inputType === 'file' ? !file : !url)}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
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
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <span className="text-sm text-gray-500">
              {stats.characterCount.toLocaleString()} characters
            </span>
          </div>
          <div className="whitespace-pre-line">{summary}</div>
        </div>
      )}
    </div>
  )
}