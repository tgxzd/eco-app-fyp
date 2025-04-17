import { NextRequest, NextResponse } from 'next/server';
import { registerHandler } from '@/lib/auth';
import { isValidEmail } from '@/app/utils';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();
    
    console.log('Registration attempt:', { name, email });

    // Validate required fields
    if (!email || !password || !confirmPassword || !name) {
      console.log('Missing required fields');
      return NextResponse.json({ 
        success: false, 
        message: 'All fields are required' 
      }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate password matching
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return NextResponse.json({ 
        success: false, 
        message: 'Passwords do not match' 
      }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Password too short');
      return NextResponse.json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }

    console.log('Calling registerHandler');
    try {
      // Call registerHandler with separate parameters
      const response = await registerHandler(name, email, password);
      console.log('Registration response:', response);
      return response;
    } catch (handlerError) {
      console.error('Error in registerHandler:', handlerError);
      return NextResponse.json({ 
        success: false, 
        message: `Error in registration handler: ${handlerError instanceof Error ? handlerError.message : String(handlerError)}`
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Registration error details:', error);
    return NextResponse.json({ 
      success: false, 
      message: `An error occurred during registration: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
} 