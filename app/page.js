'use client'
import { useState } from 'react'
import SkillSelector from './Components/SkillSelect'
import AudioAnalysis from './Components/AudioAnalysis'
import ImageAnalysis from './Components/ImageAnalysis'
import Summarization from './Components/Summarization'

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState(null)

  const renderSkillComponent = () => {
    switch (selectedSkill) {
      case 'conversation':
        return <AudioAnalysis />
      case 'image':
        return <ImageAnalysis />
      case 'summarization':
        return <Summarization />
      default:
        return (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-300 mb-2">Welcome to AI Playground</h2>
              <p className="text-gray-400">Select a skill from the dropdown to begin exploring AI capabilities</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Professional Navigation Bar */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI Playground</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI Skill Explorer</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Experiment with different AI capabilities through our interactive playground</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <SkillSelector onSelect={setSelectedSkill} />
        </div>
        
        <div className="mt-12 rounded-xl bg-gray-800/50 p-6 border border-gray-700 backdrop-blur-sm">
          {renderSkillComponent()}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} AI Playground. All rights reserved.
        </div>
      </footer>
    </div>
  )
}