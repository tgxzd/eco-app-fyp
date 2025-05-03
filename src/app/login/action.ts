'use server';

import { login } from '@/lib/auth';
import { isValidEmail } from '@/app/utils';

export async function handleLogin(formData: FormData) {
  try {
    // Extract form data
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('remember_me') === 'on';

    console.log('Server Action: Login attempt for', { 
      email, 
      rememberMe, 
      rememberMeValue: formData.get('remember_me')
    });

    // Validate inputs
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    if (!isValidEmail(email)) {
      return { error: 'Please enter a valid email address' };
    }

    // Authenticate user with remember me option
    const result = await login(email, password, rememberMe);
    
    console.log('Login result:', { 
      success: result.success, 
      message: result.message,
      hasUser: !!result.user
    });
    
    if (!result.success) {
      return { error: result.message || 'Invalid credentials' };
    }
    
    // Login successful
    return { success: true };
  } catch (error) {
    console.error('Login error in server action:', error);
    return { error: 'An unexpected error occurred during login' };
  }
} 