// In your API route (/api/summarization/route.js)
export async function POST(request) {
  try {
    const formData = await request.formData()
    const url = formData.get('url')
    const file = formData.get('file')
    const text = formData.get('text') // Added for docx text

    if (!url && !file && !text) {
      throw new Error('Please provide either a URL, file, or text')
    }

    let extractedText = text || ''
    let fileType = ''

    if (url) {
      try {
        new URL(url) // Validate URL
        extractedText = await extractTextFromUrl(url)
        fileType = 'url'
      } catch (err) {
        throw new Error('Invalid URL: ' + err.message)
      }
    } else if (file) {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit')
      }

      const fileName = file.name.toLowerCase()
      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file)
        fileType = 'pdf'
      } else if (file.type.includes('text')) {
        extractedText = await file.text()
        fileType = 'text'
      } else {
        throw new Error('Unsupported file type. Please upload PDF or text files.')
      }
    }

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error('Extracted text is too short or empty')
    }

    const summary = await summarizeText(extractedText)

    return NextResponse.json({
      success: true,
      summary,
      characterCount: extractedText.length,
      fileType
    })

  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 } // Use 400 for client errors
    )
  }
}