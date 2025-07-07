'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/lib/auth';

export async function loginOrganization(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email and password are required'
    };
  }

  try {
    // Find organization by email
    const organization = await prisma.organization.findUnique({
      where: { email }
    });

    if (!organization) {
      return {
        error: 'Organization not found'
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, organization.password);
    if (!passwordMatch) {
      return {
        error: 'Invalid password'
      };
    }

    // Create session token
    const token = await new SignJWT({
      id: organization.id,
      email: organization.email,
      role: 'organization'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(new TextEncoder().encode(getJwtSecretKey()));

    // Set cookie
    const cookieStore = await cookies();
    await cookieStore.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 1 day
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'An error occurred during login'
    };
  }
}

export async function registerOrganization(formData: FormData) {
  const organizationName = formData.get('organizationName') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const password = formData.get('password') as string;
  const category = formData.get('category') as string;

  if (!organizationName || !email || !phoneNumber || !password || !category) {
    return {
      error: 'All fields are required'
    };
  }

  try {
    // Check if organization already exists in database
    const existingOrganization = await prisma.organization.findUnique({
      where: { email }
    });

    if (existingOrganization) {
      return {
        error: 'Organization with this email already exists'
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Import pending organizations utility
    const { addPendingOrganization } = await import('@/lib/pending-organizations');

    // Add to pending organizations instead of creating immediately
    await addPendingOrganization({
      organizationName,
      email,
      phoneNumber,
      password: hashedPassword,
      category
    });

    return {
      success: true,
      pending: true // Flag to indicate this is pending approval
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.message.includes('application with this email')) {
      return {
        error: error.message
      };
    }
    return {
      error: 'An error occurred during registration'
    };
  }
}

export async function logoutOrganization() {
  const cookieStore = await cookies();
  await cookieStore.delete('session-token');
  return { success: true };
} 