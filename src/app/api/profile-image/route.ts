import { NextRequest, NextResponse } from 'next/server';
import { getProfileImageUrl } from '@/lib/profileUtils';

/**
 * API endpoint to get the profile image URL
 * This is useful for client-side components that need the profile image URL
 * without having to implement the logic to find it
 */
export async function GET(request: NextRequest) {
  try {
    const imageUrl = await getProfileImageUrl();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Profile image not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error in profile-image API:', error);
    return NextResponse.json(
      { error: 'Failed to get profile image' },
      { status: 500 }
    );
  }
}
