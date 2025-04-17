import { NextRequest, NextResponse } from 'next/server';
import { loginHandler } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Call the login handler which returns a NextResponse with proper cookie setup
    return loginHandler(email, password, rememberMe || false);
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 