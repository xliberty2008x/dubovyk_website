import { NextRequest, NextResponse } from 'next/server';

// API route for status check
export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "API is running",
    version: "1.0.0"
  });
}

// API route for handling requests
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    return NextResponse.json({ 
      success: true,
      message: "Request received",
      data
    });
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}
