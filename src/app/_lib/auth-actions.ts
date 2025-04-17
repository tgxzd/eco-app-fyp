'use server';

import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { User } from './session';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Cookie and JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'session_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 days
};

/**
 * Generates a JWT token for authentication
 */
async function generateToken(user: User): Promise<string> {
  const { id, email, name } = user;
  return sign({ id, email, name }, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Server action to handle login
 */
export async function handleLogin(formData: FormData) {
  // Extract form data
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate input
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }
    
    // Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    
    // Set the cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      ...COOKIE_OPTIONS
    });
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Server action to handle logout
 */
export async function handleLogout() {
  // Clear the session cookie
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  // Redirect to login page
  redirect('/login');
} 