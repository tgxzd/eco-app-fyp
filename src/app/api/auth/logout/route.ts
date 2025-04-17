import { NextResponse } from 'next/server';
import { logoutHandler } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the auth token cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to logout'
      },
      { status: 500 }
    );
  }
}

// Also support GET requests for convenience
export async function GET() {
  return logoutHandler();
} 