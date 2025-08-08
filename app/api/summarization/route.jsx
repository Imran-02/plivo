import { NextResponse } from 'next/server'
import { extractTextFromPdf } from '@/lib/providers'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function extractTextFromDocx(file) {
  // In a real implementation, you would use mammoth here
  // For now we'll return a placeholder
  return "Text extracted from DOCX file (install mammoth for full functionality)"
}

async function extractTextFromUrl(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    // Simple text extraction fallback
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`)
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const url = formData.get('url')
    const file = formData.get('file')

    if (!url && !file) {
      throw new Error('No input provided - please provide either a URL or file')
    }

    let text = ''

    if (url) {
      // Basic URL validation
      if (!url.match(/^https?:\/\/.+/)) {
        throw new Error('Invalid URL format')
      }
      text = await extractTextFromUrl(url)
    } 
    else if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit')
      }

      const fileType = file.type
      const fileName = file.name.toLowerCase()

      if (fileType === 'application/pdf') {
        text = await extractTextFromPdf(file)
      } 
      else if (
        fileType.includes('document') || 
        fileName.endsWith('.docx') ||
        fileName.endsWith('.doc')
      ) {
        text = await extractTextFromDocx(file)
      } 
      else if (fileType.includes('text')) {
        text = await file.text()
      } 
      else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or text files.')
      }
    }

    if (!text || text.trim().length < 50) {
      throw new Error('Extracted text is too short or empty')
    }

    const summary = await summarizeText(text)

    return NextResponse.json({ 
      success: true,
      summary,
      characterCount: text.length 
    })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to generate summary' 
      },
      { status: 500 }
    )
  }
}