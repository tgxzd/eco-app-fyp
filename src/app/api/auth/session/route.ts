import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    // Get current session information
    const { user, isAuthenticated } = await getSession();
    
    // Return the response with the session information
    return NextResponse.json({
      success: true,
      isAuthenticated,
      user: isAuthenticated ? user : null,
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve session information'
      },
      { status: 500 }
    );
  }
} 