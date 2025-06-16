'use server';

import { logout } from '@/lib/auth';

export async function handleLogout() {
  try {
    await logout();
    return { success: true };
  } catch (error) {
    console.error('Logout error in server action:', error);
    return { error: 'An unexpected error occurred during logout' };
  }
} 