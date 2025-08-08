// app/api/summarization/route.jsx
import { NextResponse } from 'next/server'
import { extractTextFromPdf, summarizeText } from '@/lib/providers'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const url = formData.get('url')
    const file = formData.get('file')

    let text = ''

    if (url) {
      // Fetch content from URL
      const response = await fetch(url)
      const html = await response.text()
      // Simple text extraction from HTML
      text = html.replace(/<[^>]*>/g, ' ')
    } else if (file) {
      const fileType = file.type

      if (fileType === 'application/pdf') {
        text = await extractTextFromPdf(file)
      } else if (
        fileType.includes('document') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx')
      ) {
        // Placeholder for DOC/DOCX extraction
        text = 'Extracted text from Word document'
      } else {
        throw new Error('Unsupported file type')
      }
    }

    const summary = await summarizeText(text)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error during summarization:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
