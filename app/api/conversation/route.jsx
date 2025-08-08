// app/api/conversation/route.js
import { NextResponse } from 'next/server';
import { convertSpeechToText } from '@/lib/providers';
import { diarizeAudio } from '@/lib/diarization';



export async function POST(request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file uploaded' },
        { status: 400 }
      );
    }

    // Convert to text using a STT provider
    const transcript = await convertSpeechToText(audioFile);
    
    // Perform diarization (speaker separation)
    const diarizedText = await diarizeAudio(audioFile, transcript);

    return NextResponse.json({ 
      transcript, 
      diarizedText 
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}