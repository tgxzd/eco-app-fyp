'use server';

import { getCurrentUser } from '@/lib/session';
import { hashPassword, comparePassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'session_token';

// Generate a new token with updated user information
async function generateUpdatedToken(userId: string, email: string, name: string | null) {
  return sign(
    { user_id: userId, email, name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Handle name update
export async function updateName(formData: FormData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }
    
    const newName = formData.get('name') as string;
    
    if (!newName || newName.trim() === '') {
      return { error: 'Name cannot be empty' };
    }
    
    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { user_id: user.user_id },
      data: { name: newName }
    });
    
    // Update the token to reflect the name change
    const newToken = await generateUpdatedToken(
      updatedUser.user_id,
      updatedUser.email,
      updatedUser.name
    );
    
    // Update the session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    // Revalidate the path to update the UI
    revalidatePath('/profile');
    
    return { success: true, message: 'Name updated successfully' };
  } catch (error) {
    console.error('Name update error:', error);
    return { error: 'An error occurred while updating your name' };
  }
}

// Handle password update
export async function updatePassword(formData: FormData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }
    
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: 'All fields are required' };
    }
    
    if (newPassword !== confirmPassword) {
      return { error: 'New passwords do not match' };
    }
    
    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters long' };
    }
    
    // Get the user with password from database
    const dbUser = await prisma.user.findUnique({
      where: { user_id: user.user_id }
    });
    
    if (!dbUser) {
      return { error: 'User not found' };
    }
    
    // Verify current password
    const isMatch = await comparePassword(currentPassword, dbUser.password);
    
    if (!isMatch) {
      return { error: 'Current password is incorrect' };
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update the password
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword }
    });
    
    // Revalidate the path to update the UI
    revalidatePath('/profile');
    
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Password update error:', error);
    return { error: 'An error occurred while updating your password' };
  }
} 