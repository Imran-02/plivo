import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Optional: for Edge Runtime

export async function POST(request) {
  try {
    // Verify the request has form data
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || imageFile === 'undefined') {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Mock response
    const mockDescriptions = [
      "A beautiful sunset over mountains",
      "A group of friends laughing together",
      "A delicious looking plate of pasta",
      "A cute puppy playing in the grass",
      "A modern city skyline at night"
    ];

    const randomDescription = mockDescriptions[
      Math.floor(Math.random() * mockDescriptions.length)
    ];

    return NextResponse.json({
      success: true,
      description: randomDescription,
      fileName: imageFile.name,
      fileType: imageFile.type,
      fileSize: imageFile.size
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}