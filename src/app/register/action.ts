'use server';

import { register } from '@/lib/auth';
import { isValidEmail } from '@/app/utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleRegister(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    console.log('Server Action: Registration attempt for', { name, email });

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      return { error: 'All fields are required' };
    }

    if (!isValidEmail(email)) {
      return { error: 'Please enter a valid email address' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long' };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Use the register function directly instead of going through API
    const result = await register(name, email, password);
    
    if (!result.success) {
      return { error: result.message || 'Failed to register' };
    }
    
    // Registration successful
    return { success: true };
  } catch (error) {
    console.error('Registration error in server action:', error);
    return { error: 'An unexpected error occurred during registration' };
  }
} 